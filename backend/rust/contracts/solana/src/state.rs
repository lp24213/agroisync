use anchor_lang::prelude::*;

#[account]
pub struct StakingPool {
    pub authority: Pubkey,
    pub total_staked: u64,
    pub total_rewards: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub last_update: i64,
}

impl StakingPool {
    pub const LEN: usize = 32 + 8 + 8 + 1 + 8 + 8;
}

#[account]
pub struct UserStake {
    pub user: Pubkey,
    pub pool: Pubkey,
    pub amount: u64,
    pub staked_at: i64,
    pub last_claim: i64,
    pub is_active: bool,
}

impl UserStake {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8 + 1;
} 