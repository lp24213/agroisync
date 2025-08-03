use anchor_lang::prelude::*;
use crate::state::*;

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    msg!("AGROTM protocol initialized");
    Ok(())
} 