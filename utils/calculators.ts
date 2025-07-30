/**
 * Calculator utilities for AGROTM
 */

// Financial calculators
export class FinancialCalculator {
  /**
   * Calculate compound interest
   */
  static compoundInterest(
    principal: number,
    rate: number,
    time: number,
    compoundingFrequency: number = 1
  ): number {
    return principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * time);
  }

  /**
   * Calculate APY from APR
   */
  static calculateAPY(apr: number, compoundingFrequency: number = 365): number {
    return (Math.pow(1 + apr / compoundingFrequency, compoundingFrequency) - 1) * 100;
  }

  /**
   * Calculate APR from APY
   */
  static calculateAPR(apy: number, compoundingFrequency: number = 365): number {
    return (Math.pow(1 + apy / 100, 1 / compoundingFrequency) - 1) * compoundingFrequency * 100;
  }

  /**
   * Calculate loan payment (PMT)
   */
  static calculateLoanPayment(
    principal: number,
    rate: number,
    periods: number
  ): number {
    const monthlyRate = rate / 12 / 100;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, periods)) / 
           (Math.pow(1 + monthlyRate, periods) - 1);
  }

  /**
   * Calculate present value
   */
  static calculatePresentValue(
    futureValue: number,
    rate: number,
    periods: number
  ): number {
    return futureValue / Math.pow(1 + rate, periods);
  }

  /**
   * Calculate future value
   */
  static calculateFutureValue(
    presentValue: number,
    rate: number,
    periods: number
  ): number {
    return presentValue * Math.pow(1 + rate, periods);
  }

  /**
   * Calculate internal rate of return (IRR)
   */
  static calculateIRR(cashFlows: number[]): number {
    // Simplified IRR calculation
    let guess = 0.1;
    const tolerance = 0.0001;
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let derivative = 0;

      for (let j = 0; j < cashFlows.length; j++) {
        const factor = Math.pow(1 + guess, j);
        npv += cashFlows[j] / factor;
        if (j > 0) {
          derivative -= j * cashFlows[j] / Math.pow(1 + guess, j + 1);
        }
      }

      const newGuess = guess - npv / derivative;
      if (Math.abs(newGuess - guess) < tolerance) {
        return newGuess;
      }
      guess = newGuess;
    }

    return guess;
  }
}

// Agricultural calculators
export class AgriculturalCalculator {
  /**
   * Calculate yield per hectare
   */
  static calculateYieldPerHectare(
    totalYield: number,
    totalArea: number,
    yieldUnit: string = 'kg',
    areaUnit: string = 'ha'
  ): number {
    // Convert to standard units
    const yieldInKg = this.convertWeight(totalYield, yieldUnit, 'kg');
    const areaInHa = this.convertArea(totalArea, areaUnit, 'ha');
    
    return yieldInKg / areaInHa;
  }

  /**
   * Calculate profit margin
   */
  static calculateProfitMargin(
    revenue: number,
    costs: number
  ): number {
    if (revenue === 0) return 0;
    return ((revenue - costs) / revenue) * 100;
  }

  /**
   * Calculate break-even point
   */
  static calculateBreakEven(
    fixedCosts: number,
    pricePerUnit: number,
    variableCostPerUnit: number
  ): number {
    if (pricePerUnit <= variableCostPerUnit) return Infinity;
    return fixedCosts / (pricePerUnit - variableCostPerUnit);
  }

  /**
   * Calculate crop water requirement
   */
  static calculateWaterRequirement(
    cropType: string,
    area: number,
    growthStage: string,
    climateFactor: number = 1.0
  ): number {
    const baseRequirements: { [key: string]: number } = {
      corn: 500, // mm per growing season
      wheat: 450,
      soybeans: 550,
      rice: 1000,
      cotton: 700
    };

    const stageMultipliers: { [key: string]: number } = {
      vegetative: 0.3,
      flowering: 1.0,
      grain_filling: 0.8,
      maturity: 0.2
    };

    const baseRequirement = baseRequirements[cropType.toLowerCase()] || 500;
    const stageMultiplier = stageMultipliers[growthStage.toLowerCase()] || 1.0;
    
    return baseRequirement * stageMultiplier * climateFactor * area / 1000; // Convert to m³
  }

  /**
   * Calculate fertilizer requirement
   */
  static calculateFertilizerRequirement(
    cropType: string,
    area: number,
    soilType: string,
    targetYield: number
  ): { nitrogen: number; phosphorus: number; potassium: number } {
    const cropRequirements: { [key: string]: { N: number; P: number; K: number } } = {
      corn: { N: 200, P: 80, K: 120 },
      wheat: { N: 150, P: 60, K: 80 },
      soybeans: { N: 0, P: 40, K: 60 },
      rice: { N: 120, P: 50, K: 70 }
    };

    const soilMultipliers: { [key: string]: number } = {
      sandy: 1.2,
      loam: 1.0,
      clay: 0.8,
      organic: 0.6
    };

    const requirements = cropRequirements[cropType.toLowerCase()] || { N: 150, P: 60, K: 80 };
    const soilMultiplier = soilMultipliers[soilType.toLowerCase()] || 1.0;

    return {
      nitrogen: requirements.N * soilMultiplier * area / 10000, // kg/ha
      phosphorus: requirements.P * soilMultiplier * area / 10000,
      potassium: requirements.K * soilMultiplier * area / 10000
    };
  }

  /**
   * Convert weight units
   */
  static convertWeight(amount: number, fromUnit: string, toUnit: string): number {
    const units: { [key: string]: number } = {
      g: 1,
      kg: 1000,
      ton: 1000000,
      lb: 453.592,
      bushel: 27215.5
    };

    const fromValue = units[fromUnit.toLowerCase()];
    const toValue = units[toUnit.toLowerCase()];

    if (!fromValue || !toValue) {
      throw new Error(`Invalid unit: ${fromUnit} or ${toUnit}`);
    }

    return (amount * fromValue) / toValue;
  }

  /**
   * Convert area units
   */
  static convertArea(amount: number, fromUnit: string, toUnit: string): number {
    const units: { [key: string]: number } = {
      'm²': 1,
      ha: 10000,
      acre: 4046.86
    };

    const fromValue = units[fromUnit.toLowerCase()];
    const toValue = units[toUnit.toLowerCase()];

    if (!fromValue || !toValue) {
      throw new Error(`Invalid unit: ${fromUnit} or ${toUnit}`);
    }

    return (amount * fromValue) / toValue;
  }
}

// DeFi calculators
export class DeFiCalculator {
  /**
   * Calculate impermanent loss
   */
  static calculateImpermanentLoss(
    initialPriceRatio: number,
    currentPriceRatio: number
  ): number {
    const sqrtPriceRatio = Math.sqrt(currentPriceRatio / initialPriceRatio);
    const impermanentLoss = (2 * sqrtPriceRatio) / (1 + currentPriceRatio / initialPriceRatio) - 1;
    return impermanentLoss * 100; // Return as percentage
  }

  /**
   * Calculate liquidity pool share
   */
  static calculatePoolShare(
    userLiquidity: number,
    totalLiquidity: number
  ): number {
    if (totalLiquidity === 0) return 0;
    return (userLiquidity / totalLiquidity) * 100;
  }

  /**
   * Calculate swap slippage
   */
  static calculateSlippage(
    inputAmount: number,
    outputAmount: number,
    expectedOutput: number
  ): number {
    if (expectedOutput === 0) return 0;
    return ((expectedOutput - outputAmount) / expectedOutput) * 100;
  }

  /**
   * Calculate gas cost in USD
   */
  static calculateGasCost(
    gasUsed: number,
    gasPrice: number,
    ethPrice: number
  ): number {
    const gasCostInEth = (gasUsed * gasPrice) / Math.pow(10, 18);
    return gasCostInEth * ethPrice;
  }

  /**
   * Calculate optimal gas price
   */
  static calculateOptimalGasPrice(
    baseFee: number,
    priorityFee: number = 1.5
  ): number {
    return baseFee + priorityFee;
  }
}

// NFT calculators
export class NFTCalculator {
  /**
   * Calculate rarity score
   */
  static calculateRarityScore(attributes: Array<{ trait_type: string; value: string }>): number {
    // Simplified rarity calculation
    let score = 0;
    attributes.forEach(attr => {
      // In a real implementation, this would use actual rarity data
      score += 10;
    });
    return Math.min(score, 100);
  }

  /**
   * Calculate floor price
   */
  static calculateFloorPrice(prices: number[]): number {
    if (prices.length === 0) return 0;
    return Math.min(...prices);
  }

  /**
   * Calculate average price
   */
  static calculateAveragePrice(prices: number[]): number {
    if (prices.length === 0) return 0;
    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  }

  /**
   * Calculate price change percentage
   */
  static calculatePriceChange(oldPrice: number, newPrice: number): number {
    if (oldPrice === 0) return newPrice > 0 ? 100 : 0;
    return ((newPrice - oldPrice) / oldPrice) * 100;
  }
}

// Staking calculators
export class StakingCalculator {
  /**
   * Calculate staking rewards
   */
  static calculateRewards(
    stakedAmount: number,
    apy: number,
    timeInDays: number
  ): number {
    const dailyRate = apy / 365 / 100;
    return stakedAmount * dailyRate * timeInDays;
  }

  /**
   * Calculate total value locked (TVL)
   */
  static calculateTVL(
    stakedAmounts: number[],
    tokenPrices: number[]
  ): number {
    if (stakedAmounts.length !== tokenPrices.length) {
      throw new Error('Arrays must have the same length');
    }
    
    return stakedAmounts.reduce((total, amount, index) => {
      return total + (amount * tokenPrices[index]);
    }, 0);
  }

  /**
   * Calculate effective APY with compounding
   */
  static calculateEffectiveAPY(
    nominalAPY: number,
    compoundingFrequency: number = 365
  ): number {
    return (Math.pow(1 + nominalAPY / compoundingFrequency, compoundingFrequency) - 1) * 100;
  }
}

// Risk calculators
export class RiskCalculator {
  /**
   * Calculate Sharpe ratio
   */
  static calculateSharpeRatio(
    returns: number[],
    riskFreeRate: number = 0.02
  ): number {
    if (returns.length === 0) return 0;
    
    const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length;
    const standardDeviation = Math.sqrt(variance);
    
    if (standardDeviation === 0) return 0;
    return (averageReturn - riskFreeRate) / standardDeviation;
  }

  /**
   * Calculate maximum drawdown
   */
  static calculateMaxDrawdown(prices: number[]): number {
    if (prices.length === 0) return 0;
    
    let maxDrawdown = 0;
    let peak = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > peak) {
        peak = prices[i];
      } else {
        const drawdown = (peak - prices[i]) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
    }
    
    return maxDrawdown * 100; // Return as percentage
  }

  /**
   * Calculate Value at Risk (VaR)
   */
  static calculateVaR(
    returns: number[],
    confidenceLevel: number = 0.95
  ): number {
    if (returns.length === 0) return 0;
    
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
    return sortedReturns[index];
  }
}

// Utility functions
export function roundToDecimals(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function formatLargeNumber(value: number): string {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(2) + 'B';
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(2) + 'M';
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(2) + 'K';
  }
  return value.toFixed(2);
}

export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
} 