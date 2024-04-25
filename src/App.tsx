import type { ReactNode } from "react";
import {
  getFieldsetProps,
  getFormProps,
  getInputProps,
  useForm,
  type FieldMetadata,
} from "@conform-to/react";
import * as z from "zod";
import { parseWithZod } from "@conform-to/zod";

const schema = z.object({
  outside: z
    .object({
      inside: z.string().array(),
    })
    .array(),
});

function App() {
  const [form, { outside }] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <form {...getFormProps(form)}>
      {outside.getFieldList().map((metadata) => (
        <InsideForm
          metadata={metadata}
          key={metadata.key}
          insideAdd={
            <button
              {...form.insert.getButtonProps({
                name: metadata.getFieldset().inside.name,
              })}
            >
              Add Inside (doesn't work)
            </button>
          }
        />
      ))}
      <button {...form.insert.getButtonProps({ name: outside.name })}>
        Add Outside (works)
      </button>
    </form>
  );
}

function InsideForm({
  metadata,
  insideAdd,
}: {
  metadata: FieldMetadata<z.infer<typeof schema.shape.outside.element>>;
  insideAdd: ReactNode;
}) {
  const { inside } = metadata.getFieldset();
  return (
    <fieldset {...getFieldsetProps(metadata)}>
      {inside.getFieldList().map((innerMetadata) => (
        <input
          {...getInputProps(innerMetadata, { type: "text" })}
          key={innerMetadata.key}
        />
      ))}
      {insideAdd}
    </fieldset>
  );
}

export default App;
