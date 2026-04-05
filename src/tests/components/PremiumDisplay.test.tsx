import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PremiumDisplay } from '../../components/common'

describe('PremiumDisplay', () => {
  it('renders the monthly premium and base premium correctly', () => {
    render(<PremiumDisplay monthlyPremium={150.55} basePremium={100} />)

    expect(screen.getByText('Estimated Monthly Premium')).toBeInTheDocument()
    expect(screen.getByText('$150.55')).toBeInTheDocument()
    expect(screen.getByText(/Base: \$100\.00/i)).toBeInTheDocument()
    expect(screen.getByText(/None applied/i)).toBeInTheDocument()
  })

  it('renders active multipliers properly', () => {
    const multipliers = { age: 1.5, tobacco: 1.2, nothing: 1.0 }
    render(
      <PremiumDisplay monthlyPremium={180} basePremium={100} appliedMultipliers={multipliers} />,
    )

    expect(screen.getByText(/age: 1\.5x, tobacco: 1\.2x/i)).toBeInTheDocument()
    expect(screen.queryByText(/nothing/)).not.toBeInTheDocument()
  })
})
