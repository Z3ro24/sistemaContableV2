import Select, { type Props as SelectProps, type GroupBase } from 'react-select';

export function CustomSelect<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: SelectProps<Option, IsMulti, Group>) {
  return (
    <Select<Option, IsMulti, Group>
      {...props}
      unstyled
      classNames={{
        control: (state) =>
          `flex min-h-[38px] w-full rounded-xl border bg-white/80 px-2 py-1 text-xs text-[#37352F] shadow-2xs backdrop-blur-md transition-all ${
            state.isFocused
              ? 'border-[#37352F] ring-1 ring-[#37352F]'
              : 'border-neutral-200 hover:border-neutral-300'
          }`,
        menu: () =>
          'mt-1.5 overflow-hidden rounded-2xl border border-white/90 bg-white/95 p-1.5 shadow-xl backdrop-blur-2xl text-xs z-50',
        option: (state) =>
          `rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
            state.isSelected
              ? 'bg-[#37352F] text-white'
              : state.isFocused
              ? 'bg-neutral-100 text-[#37352F]'
              : 'text-[#37352F]'
          }`,
        placeholder: () => 'text-[#787774]/70 text-xs',
        singleValue: () => 'text-[#37352F] text-xs font-medium',
        input: () => 'text-[#37352F] text-xs',
        dropdownIndicator: () => 'text-[#787774] p-1 hover:text-[#37352F]',
        clearIndicator: () => 'text-[#787774] p-1 hover:text-[#37352F]',
        ...props.classNames,
      }}
    />
  );
}

export default CustomSelect;
