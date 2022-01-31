import clsx from "clsx"
import { useAdminCreateNote } from "medusa-react"
import React, { useEffect } from "react"
import {
  ClaimEvent,
  ExchangeEvent,
  ItemsFulfilledEvent,
  ItemsShippedEvent,
  NoteEvent,
  OrderPlacedEvent,
  ReturnEvent,
  TimelineEvent,
  useBuildTimelime,
} from "../../../hooks/use-build-timeline"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"
import Spinner from "../../atoms/spinner"
import AlertIcon from "../../fundamentals/icons/alert-icon"
import BackIcon from "../../fundamentals/icons/back-icon"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"
import Actionables, { ActionType } from "../../molecules/actionables"
import NoteInput from "../../molecules/note-input"
import Claim from "../../molecules/timeline-events/claim"
import Exchange from "../../molecules/timeline-events/exchange"
import ItemsFulfilled from "../../molecules/timeline-events/items-fulfilled"
import ItemsShipped from "../../molecules/timeline-events/items-shipped"
import Note from "../../molecules/timeline-events/note"
import OrderCanceled from "../../molecules/timeline-events/order-canceled"
import OrderPlaced from "../../molecules/timeline-events/order-placed"
import Return from "../../molecules/timeline-events/return"

type indexProps = {
  orderId: string
}

const Timeline: React.FC<indexProps> = ({ orderId }) => {
  const { events, refetch } = useBuildTimelime(orderId)
  const toaster = useToaster()
  const createNote = useAdminCreateNote()

  const actions: ActionType[] = [
    {
      icon: <BackIcon size={20} />,
      label: "Request Return",
      onClick: () => {},
    },
    {
      icon: <RefreshIcon size={20} />,
      label: "Register Exchange",
      onClick: () => {},
    },
    {
      icon: <AlertIcon size={20} />,
      label: "Register Claim",
      onClick: () => {},
    },
  ]

  const handleCreateNote = (value: string | undefined) => {
    if (!value) return
    createNote.mutate(
      {
        resource_id: orderId,
        resource_type: "order",
        value: value,
      },
      {
        onSuccess: () => toaster("Added note", "success"),
        onError: (err) => toaster(getErrorMessage(err), "error"),
      }
    )
  }

  useEffect(() => {
    console.log("Timeline rerendered")
  }, [])

  return (
    <div className="rounded-rounded bg-grey-0 border border-grey-20">
      <div className="py-large px-xlarge border-b border-grey-20">
        <div className="flex items-center justify-between">
          <h3 className="inter-xlarge-semibold">Timeline</h3>
          <div
            className={clsx({
              "pointer-events-none opacity-50": !events,
            })}
          >
            <Actionables actions={actions} />
          </div>
        </div>
        <div
          className={clsx("mt-base", {
            "pointer-events-none opacity-50": !events,
          })}
        >
          <NoteInput onSubmit={handleCreateNote} />
        </div>
      </div>
      <div className="py-large px-xlarge">
        {!events ? (
          <div className="h-96 w-full flex items-center justify-center">
            <Spinner variant="secondary" size="large" />
          </div>
        ) : (
          <div className="flex flex-col gap-y-base">
            {events.map((event, i) => {
              return <div key={i}>{switchOnType(event, refetch)}</div>
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function switchOnType(event: TimelineEvent, refetch: () => void) {
  switch (event.type) {
    case "placed":
      return <OrderPlaced event={event as OrderPlacedEvent} />
    case "fulfilled":
      return <ItemsFulfilled event={event as ItemsFulfilledEvent} />
    case "note":
      return <Note event={event as NoteEvent} />
    case "shipped":
      return <ItemsShipped event={event as ItemsShippedEvent} />
    case "canceled":
      return <OrderCanceled event={event as TimelineEvent} />
    case "return":
      return <Return event={event as ReturnEvent} refetch={refetch} />
    case "exchange":
      return <Exchange event={event as ExchangeEvent} />
    case "claim":
      return <Claim event={event as ClaimEvent} />
    default:
      return <div>{event.type}</div>
  }
}

export default Timeline