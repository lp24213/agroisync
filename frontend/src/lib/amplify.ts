import { Amplify } from 'aws-amplify';

// Configuração AWS Amplify para produção
const awsConfig = {
    "aws_project_region": "us-east-2",
    "aws_appsync_graphqlEndpoint": "https://o6h7rhvsj5c43bhrz25djt53qa.appsync-api.us-east-2.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-2",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": "da2-7zd4l2ohvbhuzcpqhmu5suka3y",
    "aws_content_delivery_url": "https://agroisync.com",
    "aws_cognito_identity_pool_id": "us-east-2:451573af-47df-4d42-a31d-80e3c508244f",
    "aws_cognito_region": "us-east-2",
    "aws_user_pools_id": "us-east-2_Kdj83pqi3",
    "aws_user_pools_web_client_id": "uujetgmh374054t0hnvdjojqp",
    "oauth": {},
    "aws_cognito_username_attributes": ["EMAIL"],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": ["SMS"],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": [
            "REQUIRES_LOWERCASE",
            "REQUIRES_NUMBERS",
            "REQUIRES_SYMBOLS",
            "REQUIRES_UPPERCASE"
        ]
    },
    "aws_cognito_verification_mechanisms": ["EMAIL"]
};

Amplify.configure(awsConfig);

export default Amplify;
