import { FiSearch } from "react-icons/fi";

import style from "./Form.module.css";
import toast from "react-hot-toast";

interface FormProps {
  onSubmit: (query: string) => void;
}

export default function Form({ onSubmit }: FormProps) {
  const handleSubmit = (formData: FormData) => {
    const query = formData.get('search') as string;
    if (query.trim().length === 0) {
      toast.error('It`s shouldn`t be empty!');
      return;
    }
    onSubmit(query);
  }
  
  return (
    <form className={style.form} action={handleSubmit}>
      <input
        className={style.input}
        placeholder="What do you want to write?"
        name="search"
        autoFocus
      />

      <button className={style.button} type="submit">
        <FiSearch size="16px" />
      </button>
    </form>
  );
}
