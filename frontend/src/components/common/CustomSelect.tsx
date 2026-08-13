import Select, { type Props as SelectProps, type GroupBase } from 'react-select';

export function CustomSelect<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: SelectProps<Option, IsMulti, Group>) {
  return (
    <Select<Option, IsMulti, Group>
      maxMenuHeight={220}
      {...props}
      unstyled
      classNames={{
        control: (state) =>
          `flex min-h-[36px] w-full rounded-xl border bg-white/90 px-3 py-1 text-xs text-[#37352F] shadow-2xs backdrop-blur-md transition-all ${
            state.isFocused
              ? 'border-neutral-400 ring-2 ring-neutral-400/20'
              : 'border-neutral-200 hover:border-neutral-300'
          }`,
        menu: () =>
          'absolute mt-1.5 w-full rounded-2xl border border-neutral-200/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-2xl text-xs z-50 animate-in fade-in-0 zoom-in-95',
        menuList: () => 'max-h-[200px] overflow-y-auto flex flex-col gap-1 pr-1',
        option: (state) =>
          `rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
            state.isSelected
              ? 'bg-[#37352F] text-white'
              : state.isFocused
              ? 'bg-neutral-100 text-[#37352F]'
              : 'text-[#37352F] hover:bg-neutral-50'
          }`,
        placeholder: () => 'text-[#787774]/70 text-xs font-normal',
        singleValue: () => 'text-[#37352F] text-xs font-semibold',
        input: () => 'text-[#37352F] text-xs',
        dropdownIndicator: () => 'text-[#787774] p-0.5 hover:text-[#37352F] transition-colors',
        clearIndicator: () => 'text-[#787774] p-0.5 hover:text-[#37352F] transition-colors',
        ...props.classNames,
      }}
    />
  );
}

export default CustomSelect;
