use agrotm_solana_contracts::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use solana_program_test::*;
use solana_sdk::{
    signature::{Keypair, Signer},
    system_instruction,
    transaction::Transaction,
};

#[tokio::test]
async fn test_initialize_pool() {
    let program_id = agrotm_solana_contracts::ID;
    let mut program_test = ProgramTest::new("agrotm_solana_contracts", program_id, None);
    
    let authority = Keypair::new();
    let pool_name = "Test Pool".to_string();
    let pool_description = "Test pool description".to_string();
    
    program_test.add_account(
        authority.pubkey(),
        solana_sdk::account::Account {
            lamports: 1_000_000_000,
            owner: solana_sdk::system_program::id(),
            ..Default::default()
        },
    );
    
    let (pool_pda, _bump) = Pubkey::find_program_address(
        &[b"pool", authority.pubkey().as_ref()],
        &program_id,
    );
    
    let mut context = program_test.start_with_context().await;
    context.warp_to_slot(10).unwrap();
    
    let tx = Transaction::new_signed_with_payer(
        &[
            agrotm_solana_contracts::instruction::InitializePool {
                pool: pool_pda,
                authority: authority.pubkey(),
                system_program: solana_sdk::system_program::id(),
            }
            .data(),
        ],
        Some(&authority.pubkey()),
        &[&authority],
        context.last_blockhash,
    );
    
    context.banks_client.process_transaction(tx).await.unwrap();
    
    let pool_account = context.banks_client.get_account(pool_pda).await.unwrap().unwrap();
    let pool_data = Pool::try_deserialize(&mut &pool_account.data[..]).unwrap();
    
    assert_eq!(pool_data.authority, authority.pubkey());
    assert_eq!(pool_data.pool_name, pool_name);
    assert_eq!(pool_data.pool_description, pool_description);
    assert_eq!(pool_data.total_staked, 0);
    assert_eq!(pool_data.is_active, true);
}

#[tokio::test]
async fn test_stake_tokens() {
    let program_id = agrotm_solana_contracts::ID;
    let mut program_test = ProgramTest::new("agrotm_solana_contracts", program_id, None);
    
    let authority = Keypair::new();
    let user = Keypair::new();
    let mint = Keypair::new();
    
    // Add accounts
    program_test.add_account(
        authority.pubkey(),
        solana_sdk::account::Account {
            lamports: 1_000_000_000,
            owner: solana_sdk::system_program::id(),
            ..Default::default()
        },
    );
    
    program_test.add_account(
        user.pubkey(),
        solana_sdk::account::Account {
            lamports: 1_000_000_000,
            owner: solana_sdk::system_program::id(),
            ..Default::default()
        },
    );
    
    let mut context = program_test.start_with_context().await;
    
    // Create mint
    let mint_account = Mint {
        mint_authority: Some(authority.pubkey()).try_into().unwrap(),
        supply: 1_000_000_000,
        decimals: 9,
        is_initialized: true,
        freeze_authority: Some(authority.pubkey()).try_into().unwrap(),
    };
    
    context.set_account(&mint.pubkey(), &mint_account);
    
    // Create token accounts
    let user_token_account = Keypair::new();
    let pool_token_account = Keypair::new();
    
    let user_ata = spl_associated_token_account::get_associated_token_address(
        &user.pubkey(),
        &mint.pubkey(),
    );
    
    let pool_ata = spl_associated_token_account::get_associated_token_address(
        &authority.pubkey(),
        &mint.pubkey(),
    );
    
    let user_token_account_data = TokenAccount {
        mint: mint.pubkey(),
        owner: user.pubkey(),
        amount: 1_000_000,
        delegate: None,
        state: spl_token::state::AccountState::Initialized,
        is_native: None,
        delegated_amount: 0,
        close_authority: None,
    };
    
    let pool_token_account_data = TokenAccount {
        mint: mint.pubkey(),
        owner: authority.pubkey(),
        amount: 0,
        delegate: None,
        state: spl_token::state::AccountState::Initialized,
        is_native: None,
        delegated_amount: 0,
        close_authority: None,
    };
    
    context.set_account(&user_ata, &user_token_account_data);
    context.set_account(&pool_ata, &pool_token_account_data);
    
    // Initialize pool
    let (pool_pda, _bump) = Pubkey::find_program_address(
        &[b"pool", authority.pubkey().as_ref()],
        &program_id,
    );
    
    let init_tx = Transaction::new_signed_with_payer(
        &[
            agrotm_solana_contracts::instruction::InitializePool {
                pool: pool_pda,
                authority: authority.pubkey(),
                system_program: solana_sdk::system_program::id(),
            }
            .data(),
        ],
        Some(&authority.pubkey()),
        &[&authority],
        context.last_blockhash,
    );
    
    context.banks_client.process_transaction(init_tx).await.unwrap();
    
    // Stake tokens
    let stake_amount = 100_000;
    let (user_stake_pda, _bump) = Pubkey::find_program_address(
        &[b"user_stake", user.pubkey().as_ref(), pool_pda.as_ref()],
        &program_id,
    );
    
    let stake_tx = Transaction::new_signed_with_payer(
        &[
            agrotm_solana_contracts::instruction::StakeTokens {
                pool: pool_pda,
                user_stake: user_stake_pda,
                user: user.pubkey(),
                user_token_account: user_ata,
                pool_token_account: pool_ata,
                token_program: spl_token::id(),
                system_program: solana_sdk::system_program::id(),
            }
            .data(),
        ],
        Some(&user.pubkey()),
        &[&user],
        context.last_blockhash,
    );
    
    context.banks_client.process_transaction(stake_tx).await.unwrap();
    
    // Verify stake
    let user_stake_account = context.banks_client.get_account(user_stake_pda).await.unwrap().unwrap();
    let user_stake_data = UserStake::try_deserialize(&mut &user_stake_account.data[..]).unwrap();
    
    assert_eq!(user_stake_data.user, user.pubkey());
    assert_eq!(user_stake_data.pool, pool_pda);
    assert_eq!(user_stake_data.amount, stake_amount);
    assert_eq!(user_stake_data.is_active, true);
}

#[tokio::test]
async fn test_calculate_rewards() {
    let amount = 1_000_000; // 1 token with 6 decimals
    let duration = 365 * 24 * 60 * 60; // 1 year in seconds
    
    let rewards = calculate_rewards(amount, duration).unwrap();
    
    // 10% APY on 1 token for 1 year should be 0.1 tokens
    let expected_rewards = 100_000; // 0.1 tokens with 6 decimals
    assert_eq!(rewards, expected_rewards);
} 