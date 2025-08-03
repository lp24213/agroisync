use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

pub fn handler(ctx: Context<ClaimRewards>) -> Result<()> {
    let pool = &ctx.accounts.staking_pool;
    require!(pool.is_active, AgrotmError::InvalidPoolState);
    
    // Calculate rewards based on staking duration and amount
    let current_time = Clock::get()?.unix_timestamp;
    let rewards = calculate_rewards(pool.total_staked, current_time - pool.last_update)?;

    if rewards > 0 {
        // Transfer rewards to user
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.staking_pool.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, rewards)?;

        msg!("Claimed {} rewards", rewards);
    }

    Ok(())
}

fn calculate_rewards(amount: u64, duration: i64) -> Result<u64> {
    // Simple reward calculation: 10% APY
    let annual_rate = 10; // 10%
    let seconds_per_year = 365 * 24 * 60 * 60;
    
    let rewards = amount
        .checked_mul(annual_rate as u64)
        .ok_or(AgrotmError::Overflow)?
        .checked_mul(duration as u64)
        .ok_or(AgrotmError::Overflow)?
        .checked_div(100)
        .ok_or(AgrotmError::Overflow)?
        .checked_div(seconds_per_year as u64)
        .ok_or(AgrotmError::Overflow)?;
    
    Ok(rewards)
} 