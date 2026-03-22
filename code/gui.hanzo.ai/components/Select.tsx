import { LinearGradient } from '@hanzo/gui-linear-gradient'
import { ChevronDown, ChevronUp } from '@hanzo/gui-lucide-icons-2'
import type { SelectItemProps, SelectProps, SelectTriggerProps } from '@hanzo/gui'
import { Select as GuiSelect, YStack, useProps, withStaticProperties } from '@hanzo/gui'

export const SelectItem = ({ children, index, ...props }: SelectItemProps) => {
  return (
    <GuiSelect.Item index={index + 1} borderColor="transparent" {...props}>
      <GuiSelect.ItemText>{children}</GuiSelect.ItemText>
    </GuiSelect.Item>
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
    <GuiSelect {...selectProps} zIndex={1_000_000}>
      <GuiSelect.Trigger iconAfter={ChevronDown} {...selectTriggerProps}>
        <GuiSelect.Value placeholder={placeholder} />
      </GuiSelect.Trigger>

      <GuiSelect.Content>
        <GuiSelect.ScrollUpButton
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
        </GuiSelect.ScrollUpButton>

        <GuiSelect.Viewport
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
        </GuiSelect.Viewport>

        <GuiSelect.ScrollDownButton
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
        </GuiSelect.ScrollDownButton>
      </GuiSelect.Content>
    </GuiSelect>
  )
}

export const Select = withStaticProperties(SelectComponent, {
  Item: SelectItem,
  ItemText: GuiSelect.ItemText,
  Group: GuiSelect.Group,
  Label: GuiSelect.Label,
})
