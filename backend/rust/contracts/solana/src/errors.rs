use anchor_lang::prelude::*;

#[error_code]
pub enum AgrotmError {
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    #[msg("Stake is not active")]
    StakeNotActive,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Invalid pool state")]
    InvalidPoolState,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid token account")]
    InvalidTokenAccount,
} 