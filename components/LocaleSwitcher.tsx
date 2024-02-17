import { useLocale } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function LocaleSwitcher() {
  const locale = useLocale();
  return (
    <LocaleSwitcherSelect defaultValue={locale}>
      <option value="en">English</option>
      <option value="de">Deutch</option>
      <option value="he">עברית</option>
    </LocaleSwitcherSelect>
  );
}
