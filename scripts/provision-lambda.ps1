param(
  [string]$Region = 'us-east-2',
  [string]$AccountId,
  [string]$FunctionName = 'agrotmsol',
  [string]$ApiName = 'agrotm-backend-api',
  [string]$RoleName = 'agrotmsol-lambda-role'
)

$ErrorActionPreference = 'Stop'

function Require-AwsCli {
  if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    throw 'AWS CLI não encontrado. Instale e configure o AWS CLI (v2).'
  }
  aws --version | Out-Null
}

function Ensure-Role {
  param([string]$RoleName)
  try {
    aws iam get-role --role-name $RoleName | Out-Null
  } catch {
    $trust = '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
    $tmp = New-TemporaryFile
    Set-Content -Path $tmp -Value $trust -Encoding ascii
    aws iam create-role --role-name $RoleName --assume-role-policy-document ("file://{0}" -f $tmp) | Out-Null
    aws iam attach-role-policy --role-name $RoleName --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole | Out-Null
    Start-Sleep -Seconds 8
  }
}

function Ensure-Lambda {
  param([string]$FunctionName,[string]$Region,[string]$RoleArn,[string]$ZipPath)
  try {
    aws lambda get-function --function-name $FunctionName --region $Region | Out-Null
    aws lambda update-function-code --function-name $FunctionName --zip-file ("fileb://{0}" -f $ZipPath) --region $Region | Out-Null
  } catch {
    aws lambda create-function --function-name $FunctionName --runtime nodejs18.x --role $RoleArn --handler lambda-handler.handler --zip-file ("fileb://{0}" -f $ZipPath) --region $Region | Out-Null
  }
}

function Ensure-HttpApi {
  param([string]$ApiName,[string]$Region)
  $apiId = $null
  try {
    $apis = (aws apigatewayv2 get-apis --region $Region | ConvertFrom-Json).Items
    $apiId = ($apis | Where-Object { $_.Name -eq $ApiName } | Select-Object -First 1).ApiId
  } catch {}
  if (-not $apiId) {
    $apiId = (aws apigatewayv2 create-api --name $ApiName --protocol-type HTTP --region $Region | ConvertFrom-Json).ApiId
  }
  return $apiId
}

function Ensure-Integration {
  param([string]$ApiId,[string]$Region,[string]$LambdaArn)
  $integrationId = $null
  try {
    $ints = (aws apigatewayv2 get-integrations --api-id $ApiId --region $Region | ConvertFrom-Json).Items
    $integrationId = ($ints | Select-Object -First 1).IntegrationId
  } catch {}
  if (-not $integrationId) {
    $integrationId = (aws apigatewayv2 create-integration --api-id $ApiId --integration-type AWS_PROXY --integration-uri $LambdaArn --payload-format-version 2.0 --region $Region | ConvertFrom-Json).IntegrationId
  }
  return $integrationId
}

function Ensure-Route {
  param([string]$ApiId,[string]$Region,[string]$RouteKey,[string]$IntegrationId)
  $exists = $false
  try {
    $routes = (aws apigatewayv2 get-routes --api-id $ApiId --region $Region | ConvertFrom-Json).Items
    $exists = $routes | Where-Object { $_.RouteKey -eq $RouteKey } | ForEach-Object { $true } | Measure-Object | Select-Object -ExpandProperty Count
  } catch {}
  if (-not $exists) {
    aws apigatewayv2 create-route --api-id $ApiId --route-key $RouteKey --target ("integrations/{0}" -f $IntegrationId) --region $Region | Out-Null
  }
}

function Ensure-Deployment {
  param([string]$ApiId,[string]$Region)
  try { aws apigatewayv2 create-deployment --api-id $ApiId --stage-name '$default' --region $Region | Out-Null } catch {}
}

function Ensure-Permission {
  param([string]$FunctionName,[string]$Region,[string]$AccountId,[string]$ApiId)
  $sid = 'apigw-invoke-' + ([Guid]::NewGuid().ToString('N'))
  $srcArn = ('arn:aws:execute-api:{0}:{1}:{2}/*/*/*' -f $Region,$AccountId,$ApiId)
  try {
    aws lambda add-permission --function-name $FunctionName --statement-id $sid --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn $srcArn --region $Region | Out-Null
  } catch {}
}

# Main
Require-AwsCli

$repoRoot = (Split-Path $PSScriptRoot -Parent)
$zipPath = Join-Path $repoRoot 'function.zip'
if (-not (Test-Path $zipPath)) { throw "function.zip não encontrado em $repoRoot" }

Ensure-Role -RoleName $RoleName
$roleArn = ('arn:aws:iam::{0}:role/{1}' -f $AccountId,$RoleName)

Ensure-Lambda -FunctionName $FunctionName -Region $Region -RoleArn $roleArn -ZipPath $zipPath

$apiId = Ensure-HttpApi -ApiName $ApiName -Region $Region
$lambdaArn = ('arn:aws:lambda:{0}:{1}:function:{2}' -f $Region,$AccountId,$FunctionName)
$integrationId = Ensure-Integration -ApiId $apiId -Region $Region -LambdaArn $lambdaArn

Ensure-Route -ApiId $apiId -Region $Region -RouteKey 'ANY /' -IntegrationId $integrationId
Ensure-Route -ApiId $apiId -Region $Region -RouteKey 'ANY /{proxy+}' -IntegrationId $integrationId
Ensure-Deployment -ApiId $apiId -Region $Region
Ensure-Permission -FunctionName $FunctionName -Region $Region -AccountId $AccountId -ApiId $apiId

$apiUrl = ('https://{0}.execute-api.{1}.amazonaws.com' -f $apiId,$Region)
Write-Host ("API URL: $apiUrl")

try {
  $apps = (aws amplify list-apps --region $Region | ConvertFrom-Json).apps
  if ($apps) {
    foreach ($app in $apps) {
      $envVars = ('NEXT_PUBLIC_API_URL={0},NEXT_PUBLIC_APP_URL=https://agrotmsol.com.br' -f $apiUrl)
      aws amplify update-branch --app-id $app.appId --branch-name main --environment-variables $envVars --region $Region | Out-Null
    }
  }
} catch {}

Write-Host 'Concluído: Lambda + API Gateway prontos e envs do Amplify atualizados.'


