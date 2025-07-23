use anchor_lang::prelude::*;

declare_id!("AGROTM111111111111111111111111111111111111111");

#[program]
pub mod agrotm_staking {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.staked += amount;
        Ok(())
    }
    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        require!(user.staked >= amount, CustomError::InsufficientStaked);
        user.staked -= amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Account<'info, User>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Account<'info, User>,
}

#[account]
pub struct User {
    pub staked: u64,
}

#[error_code]
pub enum CustomError {
    #[msg("Insufficient staked amount")]
    InsufficientStaked,
} 