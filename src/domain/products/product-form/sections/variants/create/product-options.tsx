import React, { useEffect } from "react"
import {
  Controller,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form"
import Button from "../../../../../../components/fundamentals/button"
import TrashIcon from "../../../../../../components/fundamentals/icons/trash-icon"
import { default as Input } from "../../../../../../components/molecules/input"
import TagInput from "../../../../../../components/molecules/tag-input"
import { useProductForm } from "../../../form/product-form-context"
import { ProductFormValues, ProductOption } from "../../../utils/types"

type ProductOptionProps = {
  createVariant: UseFieldArrayAppend<ProductFormValues, "variants">
  deleteVariant: UseFieldArrayRemove
}

const ProductOptions = ({
  createVariant,
  deleteVariant,
}: ProductOptionProps) => {
  const { control, register, watch } = useProductForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  })

  // const detectChange = () => {
  //   const { options, variants } = getValues()

  //   console.log("variants", variants)
  //   console.log("options", options)

  //   if (!options) {
  //     return
  //   }

  //   const combinations = getNewCombinations(options, variants)

  //   const newVariants: VariantFormValues[] = combinations.map((c) => {
  //     return {
  //       title: c.join(" / "),
  //       ean: null,
  //       sku: null,
  //       inventory_quantity: null,
  //       options: c.map((o) => ({ value: o })),
  //     }
  //   })

  //   createVariant(newVariants, {
  //     shouldFocus: false,
  //   })
  // }

  const watchFieldArray = watch("options")
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })

  useEffect(() => {
    console.log(getNewCombinations(controlledFields))
  }, [controlledFields])

  return (
    <div>
      <div className="flex items-center mb-base">
        <h6 className="inter-base-semibold text-grey-90 mr-1.5">
          Product Options
        </h6>
      </div>
      <div className="flex flex-col gap-y-base max-w-[570px] w-full mb-4">
        {fields.map((o, index) => (
          <div key={o.id} className="flex items-center">
            <div className="flex gap-x-2xsmall grow">
              <Input
                required
                className="w-[144px]"
                {...register(`options.${index}.name`)}
                label="Option title"
                placeholder="Color, Size..."
              />
              <Controller
                name={`options.${index}.values`}
                control={control}
                defaultValue={o?.values || []}
                render={({ field: { onChange, value } }) => {
                  return (
                    <TagInput
                      className="grow"
                      placeholder="Blue, Green..."
                      values={value}
                      onChange={onChange}
                    />
                  )
                }}
              />
            </div>
            <Button
              variant="ghost"
              size="small"
              className="ml-base"
              onClick={() => remove(index)}
            >
              <TrashIcon className="text-grey-40" size={20} />
            </Button>
          </div>
        ))}
        <div className="mt-xs">
          <Button
            onClick={() =>
              append({
                name: "",
                values: [],
              })
            }
            size="small"
            variant="ghost"
          >
            + Add an option
          </Button>
        </div>
      </div>
    </div>
  )
}

const getNewCombinations = (options: ({ id: string } & ProductOption)[]) => {
  const combinations: string[][] = []

  const getCombination = (options: ProductOption[], current: string[]) => {
    if (options.length === 0) {
      combinations.push(current)
    } else {
      const [head, ...tail] = options
      for (const value of head.values) {
        getCombination(tail, [...current, value])
      }
    }
  }

  getCombination(options, [])

  return combinations
}

export default ProductOptions
