import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useForm, FormProvider } from 'react-hook-form'
import { RadioYesNoField } from '../../components/forms'
import userEvent from '@testing-library/user-event'

const Wrapper = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode
  defaultValues?: NonNullable<unknown>
}) => {
  const methods = useForm({ defaultValues })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('RadioYesNoField', () => {
  it('renders correctly with given label', () => {
    render(
      <Wrapper defaultValues={{ testField: '' }}>
        <RadioYesNoField name="testField" label="Are you a robot?" />
      </Wrapper>,
    )

    expect(screen.getByText('Are you a robot?')).toBeInTheDocument()
    expect(screen.getByLabelText('Yes')).toBeInTheDocument()
    expect(screen.getByLabelText('No')).toBeInTheDocument()
  })

  it('changes value upon interaction', async () => {
    const user = userEvent.setup()

    render(
      <Wrapper defaultValues={{ testField: '' }}>
        <RadioYesNoField name="testField" label="Are you a robot?" />
      </Wrapper>,
    )

    const yesRadio = screen.getByLabelText('Yes')
    const noRadio = screen.getByLabelText('No')

    expect(yesRadio).not.toBeChecked()
    expect(noRadio).not.toBeChecked()

    await user.click(yesRadio)
    expect(yesRadio).toBeChecked()
    expect(noRadio).not.toBeChecked()

    await user.click(noRadio)
    expect(noRadio).toBeChecked()
    expect(yesRadio).not.toBeChecked()
  })
})
