# SOAR Threat Response Automation Script
# Advanced PowerShell script for automated incident response

param(
    [Parameter(Mandatory=$true)]
    [string]$ThreatType,
    
    [Parameter(Mandatory=$true)]
    [string]$TargetHost,
    
    [Parameter(Mandatory=$false)]
    [string]$Severity = "medium",
    
    [Parameter(Mandatory=$false)]
    [string]$IOCs,
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoContain,
    
    [Parameter(Mandatory=$false)]
    [string]$LogPath = "C:\SOAR\Logs\response.log"
)

# Import required modules
Import-Module ActiveDirectory -ErrorAction SilentlyContinue
Import-Module NetSecurity -ErrorAction SilentlyContinue

# Global variables
$script:LogFile = $LogPath
$script:StartTime = Get-Date
$script:ResponseActions = @()

# Logging function
function Write-SOARLog {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    Write-Host $logEntry -ForegroundColor $(switch($Level) {
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "White" }
    })
    
    # Ensure log directory exists
    $logDir = Split-Path $script:LogFile -Parent
    if (!(Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    
    Add-Content -Path $script:LogFile -Value $logEntry
}

# Network isolation functions
function Invoke-NetworkIsolation {
    param(
        [string]$ComputerName
    )
    
    Write-SOARLog "Starting network isolation for $ComputerName"
    
    try {
        # Block all inbound/outbound traffic except management
        $firewallRules = @(
            @{Name="SOAR-Block-Inbound"; Direction="Inbound"; Action="Block"; Protocol="Any"},
            @{Name="SOAR-Block-Outbound"; Direction="Outbound"; Action="Block"; Protocol="Any"},
            @{Name="SOAR-Allow-Management"; Direction="Inbound"; Action="Allow"; Protocol="TCP"; LocalPort="3389,5985,5986"}
        )
        
        foreach ($rule in $firewallRules) {
            $params = @{
                DisplayName = $rule.Name
                Direction = $rule.Direction
                Action = $rule.Action
                Protocol = $rule.Protocol
            }
            
            if ($rule.LocalPort) {
                $params.LocalPort = $rule.LocalPort
            }
            
            Invoke-Command -ComputerName $ComputerName -ScriptBlock {
                param($RuleParams)
                New-NetFirewallRule @RuleParams -ErrorAction SilentlyContinue
            } -ArgumentList $params
        }
        
        $script:ResponseActions += "Network isolation applied to $ComputerName"
        Write-SOARLog "Network isolation completed for $ComputerName" "SUCCESS"
        return $true
        
    } catch {
        Write-SOARLog "Failed to isolate $ComputerName : $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Process termination
function Stop-MaliciousProcesses {
    param(
        [string]$ComputerName,
        [string[]]$ProcessNames
    )
    
    Write-SOARLog "Terminating malicious processes on $ComputerName"
    
    try {
        foreach ($processName in $ProcessNames) {
            Invoke-Command -ComputerName $ComputerName -ScriptBlock {
                param($ProcName)
                Get-Process -Name $ProcName -ErrorAction SilentlyContinue | Stop-Process -Force
            } -ArgumentList $processName
            
            Write-SOARLog "Terminated process: $processName on $ComputerName"
        }
        
        $script:ResponseActions += "Terminated malicious processes on $ComputerName"
        return $true
        
    } catch {
        Write-SOARLog "Failed to terminate processes on $ComputerName : $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# File quarantine
function Invoke-FileQuarantine {
    param(
        [string]$ComputerName,
        [string[]]$FilePaths
    )
    
    Write-SOARLog "Quarantining files on $ComputerName"
    
    try {
        $quarantineDir = "C:\SOAR\Quarantine\$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        
        Invoke-Command -ComputerName $ComputerName -ScriptBlock {
            param($QuarDir, $Files)
            
            # Create quarantine directory
            New-Item -ItemType Directory -Path $QuarDir -Force | Out-Null
            
            foreach ($file in $Files) {
                if (Test-Path $file) {
                    $fileName = Split-Path $file -Leaf
                    $quarantinePath = Join-Path $QuarDir $fileName
                    
                    # Move file to quarantine
                    Move-Item -Path $file -Destination $quarantinePath -Force
                    
                    # Set restrictive permissions
                    $acl = Get-Acl $quarantinePath
                    $acl.SetAccessRuleProtection($true, $false)
                    Set-Acl -Path $quarantinePath -AclObject $acl
                }
            }
        } -ArgumentList $quarantineDir, $FilePaths
        
        $script:ResponseActions += "Quarantined files on $ComputerName to $quarantineDir"
        Write-SOARLog "File quarantine completed on $ComputerName" "SUCCESS"
        return $true
        
    } catch {
        Write-SOARLog "Failed to quarantine files on $ComputerName : $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Registry cleanup
function Invoke-RegistryCleanup {
    param(
        [string]$ComputerName,
        [string[]]$RegistryKeys
    )
    
    Write-SOARLog "Cleaning malicious registry entries on $ComputerName"
    
    try {
        foreach ($regKey in $RegistryKeys) {
            Invoke-Command -ComputerName $ComputerName -ScriptBlock {
                param($Key)
                if (Test-Path "Registry::$Key") {
                    Remove-Item -Path "Registry::$Key" -Recurse -Force
                }
            } -ArgumentList $regKey
            
            Write-SOARLog "Removed registry key: $regKey on $ComputerName"
        }
        
        $script:ResponseActions += "Cleaned registry entries on $ComputerName"
        return $true
        
    } catch {
        Write-SOARLog "Failed to clean registry on $ComputerName : $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# User account management
function Invoke-UserAccountResponse {
    param(
        [string]$Username,
        [string]$Action # "disable", "reset", "lockout"
    )
    
    Write-SOARLog "Executing user account action: $Action for $Username"
    
    try {
        switch ($Action.ToLower()) {
            "disable" {
                Disable-ADAccount -Identity $Username
                Write-SOARLog "Disabled user account: $Username" "SUCCESS"
            }
            "reset" {
                $newPassword = ConvertTo-SecureString "TempPass123!" -AsPlainText -Force
                Set-ADAccountPassword -Identity $Username -NewPassword $newPassword -Reset
                Set-ADUser -Identity $Username -ChangePasswordAtLogon $true
                Write-SOARLog "Reset password for user: $Username" "SUCCESS"
            }
            "lockout" {
                Search-ADAccount -LockedOut | Where-Object {$_.SamAccountName -eq $Username} | Unlock-ADAccount
                Write-SOARLog "Unlocked user account: $Username" "SUCCESS"
            }
        }
        
        $script:ResponseActions += "User account action ($Action) for $Username"
        return $true
        
    } catch {
        Write-SOARLog "Failed user account action for $Username : $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Evidence collection
function Invoke-EvidenceCollection {
    param(
        [string]$ComputerName
    )
    
    Write-SOARLog "Collecting forensic evidence from $ComputerName"
    
    try {
        $evidenceDir = "C:\SOAR\Evidence\$ComputerName\$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
        
        # Collect system information
        $systemInfo = Invoke-Command -ComputerName $ComputerName -ScriptBlock {
            @{
                ComputerInfo = Get-ComputerInfo
                Processes = Get-Process | Select-Object Name, Id, CPU, WorkingSet, StartTime
                Services = Get-Service | Select-Object Name, Status, StartType
                NetworkConnections = Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, State
                EventLogs = Get-WinEvent -FilterHashtable @{LogName='Security'; StartTime=(Get-Date).AddHours(-24)} -MaxEvents 1000
                InstalledSoftware = Get-WmiObject -Class Win32_Product | Select-Object Name, Version, InstallDate
            }
        }
        
        # Save evidence
        $systemInfo | ConvertTo-Json -Depth 10 | Out-File "$evidenceDir\system_info.json"
        
        # Collect memory dump (if tools available)
        $memoryDumpPath = "$evidenceDir\memory.dmp"
        Invoke-Command -ComputerName $ComputerName -ScriptBlock {
            param($DumpPath)
            # This would require additional tools like WinPmem or similar
            # winpmem.exe $DumpPath
        } -ArgumentList $memoryDumpPath
        
        $script:ResponseActions += "Evidence collected from $ComputerName to $evidenceDir"
        Write-SOARLog "Evidence collection completed for $ComputerName" "SUCCESS"
        return $evidenceDir
        
    } catch {
        Write-SOARLog "Failed to collect evidence from $ComputerName : $($_.Exception.Message)" "ERROR"
        return $null
    }
}

# Notification functions
function Send-SOARNotification {
    param(
        [string]$Message,
        [string]$Severity,
        [string[]]$Recipients = @("security@company.com")
    )
    
    Write-SOARLog "Sending notification: $Message"
    
    try {
        # Email notification
        $emailParams = @{
            To = $Recipients
            From = "soar@company.com"
            Subject = "SOAR Alert - $Severity Severity"
            Body = @"
SOAR Automated Response Alert

Severity: $Severity
Timestamp: $(Get-Date)
Target Host: $TargetHost
Threat Type: $ThreatType

Message: $Message

Actions Taken:
$(($script:ResponseActions | ForEach-Object { "- $_" }) -join "`n")

This is an automated message from the SOAR system.
"@
            SmtpServer = "smtp.company.com"
        }
        
        Send-MailMessage @emailParams
        
        # Slack notification (if webhook configured)
        $slackWebhook = $env:SLACK_WEBHOOK_URL
        if ($slackWebhook) {
            $slackPayload = @{
                text = "🚨 SOAR Alert - $Severity"
                attachments = @(
                    @{
                        color = switch($Severity) {
                            "critical" { "danger" }
                            "high" { "warning" }
                            default { "good" }
                        }
                        fields = @(
                            @{title="Target Host"; value=$TargetHost; short=$true},
                            @{title="Threat Type"; value=$ThreatType; short=$true},
                            @{title="Message"; value=$Message; short=$false}
                        )
                    }
                )
            } | ConvertTo-Json -Depth 10
            
            Invoke-RestMethod -Uri $slackWebhook -Method Post -Body $slackPayload -ContentType "application/json"
        }
        
        Write-SOARLog "Notification sent successfully" "SUCCESS"
        return $true
        
    } catch {
        Write-SOARLog "Failed to send notification: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Main threat response logic
function Invoke-ThreatResponse {
    Write-SOARLog "Starting threat response for $ThreatType on $TargetHost (Severity: $Severity)"
    
    $success = $true
    
    try {
        # Parse IOCs if provided
        $iocList = @()
        if ($IOCs) {
            $iocList = $IOCs -split "," | ForEach-Object { $_.Trim() }
        }
        
        # Execute response based on threat type
        switch ($ThreatType.ToLower()) {
            "malware" {
                Write-SOARLog "Executing malware response playbook"
                
                # 1. Network isolation
                if ($AutoContain -or $Severity -in @("high", "critical")) {
                    $success = $success -and (Invoke-NetworkIsolation -ComputerName $TargetHost)
                }
                
                # 2. Process termination
                $maliciousProcesses = @("malware.exe", "trojan.exe", "ransomware.exe")
                $success = $success -and (Stop-MaliciousProcesses -ComputerName $TargetHost -ProcessNames $maliciousProcesses)
                
                # 3. File quarantine
                if ($iocList.Count -gt 0) {
                    $filePaths = $iocList | Where-Object { $_ -like "*\*" -or $_ -like "*.*" }
                    if ($filePaths) {
                        $success = $success -and (Invoke-FileQuarantine -ComputerName $TargetHost -FilePaths $filePaths)
                    }
                }
                
                # 4. Registry cleanup
                $maliciousRegKeys = @(
                    "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run\Malware",
                    "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run\Trojan"
                )
                $success = $success -and (Invoke-RegistryCleanup -ComputerName $TargetHost -RegistryKeys $maliciousRegKeys)
            }
            
            "phishing" {
                Write-SOARLog "Executing phishing response playbook"
                
                # 1. User account response
                $username = $env:USERNAME # This should be extracted from the event
                $success = $success -and (Invoke-UserAccountResponse -Username $username -Action "reset")
                
                # 2. Email quarantine (would integrate with email security tools)
                Write-SOARLog "Quarantining phishing emails (integration required)"
            }
            
            "lateral_movement" {
                Write-SOARLog "Executing lateral movement response playbook"
                
                # 1. Network isolation
                $success = $success -and (Invoke-NetworkIsolation -ComputerName $TargetHost)
                
                # 2. Credential reset
                $affectedUsers = @() # This should be extracted from the event
                foreach ($user in $affectedUsers) {
                    $success = $success -and (Invoke-UserAccountResponse -Username $user -Action "reset")
                }
            }
            
            "data_exfiltration" {
                Write-SOARLog "Executing data exfiltration response playbook"
                
                # 1. Network isolation
                $success = $success -and (Invoke-NetworkIsolation -ComputerName $TargetHost)
                
                # 2. Evidence collection
                $evidencePath = Invoke-EvidenceCollection -ComputerName $TargetHost
                $success = $success -and ($null -ne $evidencePath)
            }
            
            default {
                Write-SOARLog "Unknown threat type: $ThreatType" "WARN"
                
                # Generic response
                if ($Severity -eq "critical") {
                    $success = $success -and (Invoke-NetworkIsolation -ComputerName $TargetHost)
                }
                
                $evidencePath = Invoke-EvidenceCollection -ComputerName $TargetHost
                $success = $success -and ($null -ne $evidencePath)
            }
        }
        
        # Always collect evidence for high/critical incidents
        if ($Severity -in @("high", "critical")) {
            $evidencePath = Invoke-EvidenceCollection -ComputerName $TargetHost
        }
        
        # Send notifications
        $notificationMessage = if ($success) {
            "Threat response completed successfully for $ThreatType on $TargetHost"
        } else {
            "Threat response completed with errors for $ThreatType on $TargetHost"
        }
        
        Send-SOARNotification -Message $notificationMessage -Severity $Severity
        
        # Generate response report
        $responseReport = @{
            ThreatType = $ThreatType
            TargetHost = $TargetHost
            Severity = $Severity
            StartTime = $script:StartTime
            EndTime = Get-Date
            Duration = (Get-Date) - $script:StartTime
            Success = $success
            ActionsExecuted = $script:ResponseActions
            IOCs = $iocList
        }
        
        $reportPath = "C:\SOAR\Reports\response_$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
        $reportDir = Split-Path $reportPath -Parent
        if (!(Test-Path $reportDir)) {
            New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
        }
        
        $responseReport | ConvertTo-Json -Depth 10 | Out-File $reportPath
        
        Write-SOARLog "Response report saved to: $reportPath"
        Write-SOARLog "Threat response completed. Success: $success" $(if($success) {"SUCCESS"} else {"WARN"})
        
        return $responseReport
        
    } catch {
        Write-SOARLog "Critical error in threat response: $($_.Exception.Message)" "ERROR"
        Send-SOARNotification -Message "Critical error in threat response: $($_.Exception.Message)" -Severity "critical"
        return $null
    }
}

# Cleanup function
function Invoke-ResponseCleanup {
    Write-SOARLog "Performing cleanup operations"
    
    try {
        # Remove temporary firewall rules if needed
        $tempRules = @("SOAR-Block-Inbound", "SOAR-Block-Outbound", "SOAR-Allow-Management")
        
        if ($AutoContain -and (Read-Host "Remove isolation rules? (y/N)") -eq "y") {
            foreach ($rule in $tempRules) {
                Invoke-Command -ComputerName $TargetHost -ScriptBlock {
                    param($RuleName)
                    Remove-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
                } -ArgumentList $rule
            }
            Write-SOARLog "Isolation rules removed from $TargetHost" "SUCCESS"
        }
        
    } catch {
        Write-SOARLog "Error during cleanup: $($_.Exception.Message)" "ERROR"
    }
}

# Main execution
Write-SOARLog "SOAR Threat Response Script Started"
Write-SOARLog "Parameters: ThreatType=$ThreatType, TargetHost=$TargetHost, Severity=$Severity"

# Validate parameters
if (-not (Test-Connection -ComputerName $TargetHost -Count 1 -Quiet)) {
    Write-SOARLog "Target host $TargetHost is not reachable" "ERROR"
    exit 1
}

# Execute threat response
$result = Invoke-ThreatResponse

if ($result) {
    Write-SOARLog "Threat response execution completed"
    
    # Optional cleanup
    if ($AutoContain) {
        Invoke-ResponseCleanup
    }
    
    exit 0
} else {
    Write-SOARLog "Threat response execution failed" "ERROR"
    exit 1
}

# Example usage:
# .\threat-response.ps1 -ThreatType "malware" -TargetHost "WORKSTATION01" -Severity "high" -AutoContain
# .\threat-response.ps1 -ThreatType "phishing" -TargetHost "WORKSTATION02" -Severity "medium" -IOCs "malware.exe,C:\temp\trojan.dll"