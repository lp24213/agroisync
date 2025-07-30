use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

pub fn handler(ctx: Context<UnstakeTokens>, amount: u64) -> Result<()> {
    require!(amount > 0, AgrotmError::InsufficientStake);
    
    let pool = &mut ctx.accounts.staking_pool;
    require!(pool.total_staked >= amount, AgrotmError::InsufficientStake);

    // Transfer tokens back to user
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.staking_pool.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, amount)?;

    // Update pool
    pool.total_staked = pool.total_staked.checked_sub(amount)
        .ok_or(AgrotmError::Overflow)?;
    pool.last_update = Clock::get()?.unix_timestamp;

    msg!("Unstaked {} tokens", amount);
    Ok(())
} 