import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StepNavigation } from '../../components/common'

describe('StepNavigation', () => {
  it('renders correctly on the first step (no back button)', () => {
    const onNext = vi.fn()
    render(<StepNavigation onNext={onNext} />)

    expect(screen.queryByRole('button', { name: /Back/i })).not.toBeInTheDocument()
    const nextBtn = screen.getByRole('button', { name: /Next Step/i })
    expect(nextBtn).toBeInTheDocument()

    fireEvent.click(nextBtn)
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('renders back button and triggers onBack handler', () => {
    const onBack = vi.fn()
    render(<StepNavigation onBack={onBack} onNext={() => {}} />)

    const backBtn = screen.getByRole('button', { name: /Back/i })
    expect(backBtn).toBeInTheDocument()

    fireEvent.click(backBtn)
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('shows submit button on last step and supports start over', () => {
    const onNext = vi.fn()
    const onReset = vi.fn()

    render(<StepNavigation onNext={onNext} isLastStep={true} showReset={true} onReset={onReset} />)

    expect(screen.getByRole('button', { name: /Submit Quote/i })).toBeInTheDocument()

    const resetBtn = screen.getByRole('button', { name: /Start Over/i })
    expect(resetBtn).toBeInTheDocument()
    fireEvent.click(resetBtn)
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when isSubmitting is true', () => {
    render(<StepNavigation onBack={() => {}} onNext={() => {}} isSubmitting={true} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveTextContent(/Back/i)
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  })
})
