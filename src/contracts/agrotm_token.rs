/**
 * AGROTM Token Contract
 * Professional SPL Token implementation for AGROTM ecosystem
 * Built with Anchor framework for security and efficiency
 */

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer, MintTo, Burn};

declare_id!("AGRoTMTokenProgram11111111111111111111111111");

#[program]
pub mod agrotm_token {
    use super::*;

    /// Initialize the AGROTM token
    pub fn initialize_token(
        ctx: Context<InitializeToken>,
        name: String,
        symbol: String,
        decimals: u8,
        initial_supply: u64,
    ) -> Result<()> {
        require!(name.len() <= 32, ErrorCode::NameTooLong);
        require!(symbol.len() <= 10, ErrorCode::SymbolTooLong);
        require!(decimals <= 9, ErrorCode::InvalidDecimals);

        let token_info = &mut ctx.accounts.token_info;
        token_info.authority = ctx.accounts.authority.key();
        token_info.name = name.clone();
        token_info.symbol = symbol.clone();
        token_info.decimals = decimals;
        token_info.total_supply = initial_supply;
        token_info.is_paused = false;
        token_info.is_mintable = true;
        token_info.is_burnable = true;

        // Mint initial supply to authority
        if initial_supply > 0 {
            let cpi_accounts = MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.authority_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
            token::mint_to(cpi_ctx, initial_supply)?;
        }

        emit!(TokenInitializedEvent {
            mint: ctx.accounts.mint.key(),
            name,
            symbol,
            decimals,
            initial_supply,
        });

        msg!("AGROTM Token initialized successfully");
        Ok(())
    }

    /// Mint new tokens (authority only)
    pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
        require!(!ctx.accounts.token_info.is_paused, ErrorCode::TokenPaused);
        require!(ctx.accounts.token_info.is_mintable, ErrorCode::MintingDisabled);
        require!(amount > 0, ErrorCode::InvalidAmount);

        let token_info = &mut ctx.accounts.token_info;
        
        // Check for overflow
        require!(
            token_info.total_supply.checked_add(amount).is_some(),
            ErrorCode::SupplyOverflow
        );

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, amount)?;

        token_info.total_supply += amount;

        emit!(MintEvent {
            to: ctx.accounts.to_token_account.key(),
            amount,
            new_total_supply: token_info.total_supply,
        });

        msg!("Minted {} tokens successfully", amount);
        Ok(())
    }

    /// Burn tokens
    pub fn burn_tokens(ctx: Context<BurnTokens>, amount: u64) -> Result<()> {
        require!(!ctx.accounts.token_info.is_paused, ErrorCode::TokenPaused);
        require!(ctx.accounts.token_info.is_burnable, ErrorCode::BurningDisabled);
        require!(amount > 0, ErrorCode::InvalidAmount);

        let token_info = &mut ctx.accounts.token_info;

        let cpi_accounts = Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.from_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::burn(cpi_ctx, amount)?;

        token_info.total_supply -= amount;

        emit!(BurnEvent {
            from: ctx.accounts.from_token_account.key(),
            amount,
            new_total_supply: token_info.total_supply,
        });

        msg!("Burned {} tokens successfully", amount);
        Ok(())
    }

    /// Transfer tokens with additional validation
    pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        require!(!ctx.accounts.token_info.is_paused, ErrorCode::TokenPaused);
        require!(amount > 0, ErrorCode::InvalidAmount);

        // Check if sender is blacklisted
        if let Some(blacklist) = &ctx.accounts.blacklist {
            require!(!blacklist.is_blacklisted, ErrorCode::AddressBlacklisted);
        }

        let cpi_accounts = Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        emit!(TransferEvent {
            from: ctx.accounts.from_token_account.key(),
            to: ctx.accounts.to_token_account.key(),
            amount,
        });

        msg!("Transferred {} tokens successfully", amount);
        Ok(())
    }

    /// Pause token operations (authority only)
    pub fn pause_token(ctx: Context<AdminAction>) -> Result<()> {
        let token_info = &mut ctx.accounts.token_info;
        token_info.is_paused = true;

        emit!(PauseEvent {
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Token operations paused");
        Ok(())
    }

    /// Unpause token operations (authority only)
    pub fn unpause_token(ctx: Context<AdminAction>) -> Result<()> {
        let token_info = &mut ctx.accounts.token_info;
        token_info.is_paused = false;

        emit!(UnpauseEvent {
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Token operations unpaused");
        Ok(())
    }

    /// Disable minting permanently (authority only)
    pub fn disable_minting(ctx: Context<AdminAction>) -> Result<()> {
        let token_info = &mut ctx.accounts.token_info;
        token_info.is_mintable = false;

        emit!(MintingDisabledEvent {
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Minting disabled permanently");
        Ok(())
    }

    /// Add address to blacklist (authority only)
    pub fn add_to_blacklist(ctx: Context<ManageBlacklist>) -> Result<()> {
        let blacklist = &mut ctx.accounts.blacklist;
        blacklist.address = ctx.accounts.target_address.key();
        blacklist.is_blacklisted = true;
        blacklist.timestamp = Clock::get()?.unix_timestamp;

        emit!(BlacklistEvent {
            address: ctx.accounts.target_address.key(),
            is_blacklisted: true,
        });

        msg!("Address added to blacklist");
        Ok(())
    }

    /// Remove address from blacklist (authority only)
    pub fn remove_from_blacklist(ctx: Context<ManageBlacklist>) -> Result<()> {
        let blacklist = &mut ctx.accounts.blacklist;
        blacklist.is_blacklisted = false;
        blacklist.timestamp = Clock::get()?.unix_timestamp;

        emit!(BlacklistEvent {
            address: ctx.accounts.target_address.key(),
            is_blacklisted: false,
        });

        msg!("Address removed from blacklist");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeToken<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + TokenInfo::LEN,
        seeds = [b"token_info", mint.key().as_ref()],
        bump
    )]
    pub token_info: Account<'info, TokenInfo>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub authority_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(
        mut,
        has_one = authority @ ErrorCode::Unauthorized
    )]
    pub token_info: Account<'info, TokenInfo>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    pub authority: Signer<'info>,

    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub token_info: Account<'info, TokenInfo>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    pub authority: Signer<'info>,

    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    pub token_info: Account<'info, TokenInfo>,

    pub authority: Signer<'info>,

    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,

    /// Optional blacklist check
    pub blacklist: Option<Account<'info, Blacklist>>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AdminAction<'info> {
    #[account(
        mut,
        has_one = authority @ ErrorCode::Unauthorized
    )]
    pub token_info: Account<'info, TokenInfo>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ManageBlacklist<'info> {
    #[account(
        has_one = authority @ ErrorCode::Unauthorized
    )]
    pub token_info: Account<'info, TokenInfo>,

    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + Blacklist::LEN,
        seeds = [b"blacklist", target_address.key().as_ref()],
        bump
    )]
    pub blacklist: Account<'info, Blacklist>,

    pub authority: Signer<'info>,

    /// CHECK: This is the address being managed in blacklist
    pub target_address: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct TokenInfo {
    pub authority: Pubkey,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: u64,
    pub is_paused: bool,
    pub is_mintable: bool,
    pub is_burnable: bool,
}

impl TokenInfo {
    pub const LEN: usize = 32 + 4 + 32 + 4 + 10 + 1 + 8 + 1 + 1 + 1;
}

#[account]
pub struct Blacklist {
    pub address: Pubkey,
    pub is_blacklisted: bool,
    pub timestamp: i64,
}

impl Blacklist {
    pub const LEN: usize = 32 + 1 + 8;
}

#[event]
pub struct TokenInitializedEvent {
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub initial_supply: u64,
}

#[event]
pub struct MintEvent {
    pub to: Pubkey,
    pub amount: u64,
    pub new_total_supply: u64,
}

#[event]
pub struct BurnEvent {
    pub from: Pubkey,
    pub amount: u64,
    pub new_total_supply: u64,
}

#[event]
pub struct TransferEvent {
    pub from: Pubkey,
    pub to: Pubkey,
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

#[event]
pub struct MintingDisabledEvent {
    pub timestamp: i64,
}

#[event]
pub struct BlacklistEvent {
    pub address: Pubkey,
    pub is_blacklisted: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Token operations are paused")]
    TokenPaused,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Name too long")]
    NameTooLong,
    #[msg("Symbol too long")]
    SymbolTooLong,
    #[msg("Invalid decimals")]
    InvalidDecimals,
    #[msg("Supply overflow")]
    SupplyOverflow,
    #[msg("Minting is disabled")]
    MintingDisabled,
    #[msg("Burning is disabled")]
    BurningDisabled,
    #[msg("Address is blacklisted")]
    AddressBlacklisted,
}
