/**
 * AGROTM Staking Contract
 * Professional Solana smart contract for staking functionality
 * Built with Anchor framework for security and efficiency
 */

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("AGRoTMStakingProgram11111111111111111111111");

#[program]
pub mod agrotm_staking {
    use super::*;

    /// Initialize the staking program
    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        staking_pool.authority = ctx.accounts.authority.key();
        staking_pool.bump = bump;
        staking_pool.total_staked = 0;
        staking_pool.reward_rate = 1000; // 10% APR (basis points)
        staking_pool.last_update_time = Clock::get()?.unix_timestamp;
        staking_pool.is_paused = false;
        
        msg!("AGROTM Staking Pool initialized successfully");
        Ok(())
    }

    /// Stake tokens into the pool
    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        require!(!ctx.accounts.staking_pool.is_paused, ErrorCode::PoolPaused);
        require!(amount > 0, ErrorCode::InvalidAmount);

        let staking_pool = &mut ctx.accounts.staking_pool;
        let user_stake = &mut ctx.accounts.user_stake;
        let clock = Clock::get()?;

        // Update rewards before changing stake
        update_rewards(staking_pool, user_stake, clock.unix_timestamp)?;

        // Transfer tokens from user to pool
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update stake information
        user_stake.amount += amount;
        user_stake.last_stake_time = clock.unix_timestamp;
        staking_pool.total_staked += amount;

        emit!(StakeEvent {
            user: ctx.accounts.user.key(),
            amount,
            total_staked: user_stake.amount,
        });

        msg!("Staked {} tokens successfully", amount);
        Ok(())
    }

    /// Unstake tokens from the pool
    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        require!(!ctx.accounts.staking_pool.is_paused, ErrorCode::PoolPaused);
        require!(amount > 0, ErrorCode::InvalidAmount);

        let staking_pool = &mut ctx.accounts.staking_pool;
        let user_stake = &mut ctx.accounts.user_stake;
        let clock = Clock::get()?;

        require!(user_stake.amount >= amount, ErrorCode::InsufficientStake);

        // Update rewards before changing stake
        update_rewards(staking_pool, user_stake, clock.unix_timestamp)?;

        // Transfer tokens from pool to user
        let seeds = &[
            b"staking_pool".as_ref(),
            &[staking_pool.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.staking_pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        // Update stake information
        user_stake.amount -= amount;
        staking_pool.total_staked -= amount;

        emit!(UnstakeEvent {
            user: ctx.accounts.user.key(),
            amount,
            remaining_staked: user_stake.amount,
        });

        msg!("Unstaked {} tokens successfully", amount);
        Ok(())
    }

    /// Claim accumulated rewards
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        require!(!ctx.accounts.staking_pool.is_paused, ErrorCode::PoolPaused);

        let staking_pool = &mut ctx.accounts.staking_pool;
        let user_stake = &mut ctx.accounts.user_stake;
        let clock = Clock::get()?;

        // Update rewards
        update_rewards(staking_pool, user_stake, clock.unix_timestamp)?;

        let rewards = user_stake.pending_rewards;
        require!(rewards > 0, ErrorCode::NoRewards);

        // Transfer rewards to user
        let seeds = &[
            b"staking_pool".as_ref(),
            &[staking_pool.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_token_account.to_account_info(),
            to: ctx.accounts.user_reward_account.to_account_info(),
            authority: ctx.accounts.staking_pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, rewards)?;

        // Reset pending rewards
        user_stake.pending_rewards = 0;
        user_stake.last_claim_time = clock.unix_timestamp;

        emit!(ClaimRewardsEvent {
            user: ctx.accounts.user.key(),
            amount: rewards,
        });

        msg!("Claimed {} reward tokens successfully", rewards);
        Ok(())
    }

    /// Emergency pause (admin only)
    pub fn pause(ctx: Context<AdminAction>) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        staking_pool.is_paused = true;
        
        emit!(PauseEvent {
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Staking pool paused");
        Ok(())
    }

    /// Unpause (admin only)
    pub fn unpause(ctx: Context<AdminAction>) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        staking_pool.is_paused = false;
        
        emit!(UnpauseEvent {
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Staking pool unpaused");
        Ok(())
    }
}

/// Helper function to update rewards
fn update_rewards(
    staking_pool: &mut Account<StakingPool>,
    user_stake: &mut Account<UserStake>,
    current_time: i64,
) -> Result<()> {
    if user_stake.amount == 0 {
        user_stake.last_update_time = current_time;
        return Ok(());
    }

    let time_diff = current_time - user_stake.last_update_time;
    if time_diff <= 0 {
        return Ok(());
    }

    // Calculate rewards: (amount * rate * time) / (365 * 24 * 3600 * 10000)
    // rate is in basis points (10000 = 100%)
    let rewards = (user_stake.amount as u128)
        .checked_mul(staking_pool.reward_rate as u128)
        .unwrap()
        .checked_mul(time_diff as u128)
        .unwrap()
        .checked_div(365 * 24 * 3600 * 10000)
        .unwrap() as u64;

    user_stake.pending_rewards += rewards;
    user_stake.last_update_time = current_time;
    staking_pool.last_update_time = current_time;

    Ok(())
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + StakingPool::LEN,
        seeds = [b"staking_pool"],
        bump
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserStake::LEN,
        seeds = [b"user_stake", user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(mut)]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(mut)]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_reward_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub reward_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AdminAction<'info> {
    #[account(
        mut,
        has_one = authority @ ErrorCode::Unauthorized
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
    pub authority: Signer<'info>,
}

#[account]
pub struct StakingPool {
    pub authority: Pubkey,
    pub bump: u8,
    pub total_staked: u64,
    pub reward_rate: u64, // basis points (10000 = 100%)
    pub last_update_time: i64,
    pub is_paused: bool,
}

impl StakingPool {
    pub const LEN: usize = 32 + 1 + 8 + 8 + 8 + 1;
}

#[account]
pub struct UserStake {
    pub user: Pubkey,
    pub amount: u64,
    pub pending_rewards: u64,
    pub last_stake_time: i64,
    pub last_update_time: i64,
    pub last_claim_time: i64,
}

impl UserStake {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 8 + 8;
}

#[event]
pub struct StakeEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub total_staked: u64,
}

#[event]
pub struct UnstakeEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub remaining_staked: u64,
}

#[event]
pub struct ClaimRewardsEvent {
    pub user: Pubkey,
    pub amount: u64,
}

#[event]
pub struct PauseEvent {
    pub timestamp: i64,
}

#[event]
pub struct UnpauseEvent {
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Pool is currently paused")]
    PoolPaused,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient stake")]
    InsufficientStake,
    #[msg("No rewards to claim")]
    NoRewards,
    #[msg("Unauthorized")]
    Unauthorized,
}
