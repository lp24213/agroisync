use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

pub fn handler(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
    require!(amount > 0, AgrotmError::InsufficientStake);
    
    // Transfer tokens from user to pool
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.staking_pool.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, amount)?;

    // Update pool
    let pool = &mut ctx.accounts.staking_pool;
    pool.total_staked = pool.total_staked.checked_add(amount)
        .ok_or(AgrotmError::Overflow)?;
    pool.last_update = Clock::get()?.unix_timestamp;

    msg!("Staked {} tokens", amount);
    Ok(())
} 