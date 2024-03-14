import { useFormikContext } from "formik";
import { useEffect } from "react";

export default function DirtyDetector ({ setDirty }) {
  const { dirty } = useFormikContext();
  useEffect(() => {
    setDirty(dirty);
  }, [dirty, setDirty]);
  return null;
}