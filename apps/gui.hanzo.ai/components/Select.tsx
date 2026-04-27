import { LinearGradient } from '@hanzogui/linear-gradient'
import { ChevronDown, ChevronUp } from '@hanzogui/lucide-icons-2'
import type { SelectItemProps, SelectProps, SelectTriggerProps } from 'hanzogui'
import { Select as HanzoguiSelect, YStack, useProps, withStaticProperties } from 'hanzogui'

export const SelectItem = ({ children, index, ...props }: SelectItemProps) => {
  return (
    <HanzoguiSelect.Item index={index + 1} borderColor="transparent" {...props}>
      <HanzoguiSelect.ItemText>{children}</HanzoguiSelect.ItemText>
    </HanzoguiSelect.Item>
  )
}

const SelectComponent = (
  propsIn: SelectProps & SelectTriggerProps & { placeholder?: string }
) => {
  const {
    placeholder,
    id,
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    dir,
    name,
    autoComplete,
    size,
    children,
    onActiveChange,
    renderValue,
    variant,
    ...selectTriggerProps
  } = useProps(propsIn)
  const selectProps = {
    id,
    value,
    defaultValue,
    onActiveChange,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    dir,
    name,
    autoComplete,
    size,
    renderValue,
  } as SelectProps
  return (
    <HanzoguiSelect {...selectProps} zIndex={1_000_000}>
      <HanzoguiSelect.Trigger iconAfter={ChevronDown} {...selectTriggerProps}>
        <HanzoguiSelect.Value placeholder={placeholder} />
      </HanzoguiSelect.Trigger>

      <HanzoguiSelect.Content>
        <HanzoguiSelect.ScrollUpButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack z={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', '$background0']}
            rounded="$4"
          />
        </HanzoguiSelect.ScrollUpButton>

        <HanzoguiSelect.Viewport
          opacity={1}
          y={0}
          enterStyle={{
            opacity: 0,
            scale: 0.98,
          }}
          exitStyle={{
            opacity: 0,
            scale: 0.98,
          }}
          bg="transparent"
          className="blur-medium"
          borderWidth={1}
          borderColor="$borderColor"
        >
          {children}
        </HanzoguiSelect.Viewport>

        <HanzoguiSelect.ScrollDownButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack z={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background0', '$background']}
            rounded="$4"
          />
        </HanzoguiSelect.ScrollDownButton>
      </HanzoguiSelect.Content>
    </HanzoguiSelect>
  )
}

export const Select = withStaticProperties(SelectComponent, {
  Item: SelectItem,
  ItemText: HanzoguiSelect.ItemText,
  Group: HanzoguiSelect.Group,
  Label: HanzoguiSelect.Label,
})
