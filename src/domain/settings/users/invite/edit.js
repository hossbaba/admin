import styled from "@emotion/styled"
import { Label, Radio } from "@rebass/forms"
import React, { useState } from "react"
import { Box, Flex, Text } from "rebass"
import Button from "../../../../components/button"
import { ReactComponent as CloseIcon } from "../../../../assets/svg/cross.svg"
import Modal from "../../../../components/modal"
import { DefaultCellContent } from "../../../../components/table"
import Medusa from "../../../../services/api"
import useMedusa from "../../../../hooks/use-medusa"
import CopyToClipboard from "../../../../components/copy-to-clipboard"

const Row = styled.tr`
  font-size: ${props => props.theme.fontSizes[1]}px;
  border-top: ${props => props.theme.borders.hairline};

  td:last-child {
    padding-left: 20px;
    padding-right: 30px;
  }
`

const Cell = styled.td`
  padding: 15px 5px;
`

const EditInvite = ({ handleClose, invite, triggerRefetch }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { store, toaster } = useMedusa("store")
  const [role, setRole] = useState(invite.role)

  const onChange = e => {
    setRole(e.target.value)
  }

  const invitationUrl =
    store?.invite_link_template?.replace(/\{invite_token\}/, invite.token) ||
    "Please configure invite link template in settings"

  const copyInvitation = () => {
    navigator.clipboard.writeText(invitationUrl)
    toaster("Copied to clipboard", "success")
  }

  const resendInvite = () => {
    Medusa.invites.resend(invite.id)
  }

  const onSubmit = () => {
    const update = { users: [invite.user_email], role: role }

    setIsLoading(true)
    Medusa.invite
      .create(update)
      .then(res => res.data)
      .then(data => {
        triggerRefetch()
        setIsLoading(false)
      })
      .catch(err => toaster("Failed to edit invite", "error"))
    handleClose()
  }

  const handleDelete = () => {
    Medusa.invites
      .delete(invite.id)
      .then(() => {
        triggerRefetch()
        toaster("Deleted invitation", "success")
      })
      .catch(e => {
        toaster("Failed to delete invitation", "error")
      })
    handleClose()
  }

  return (
    <Modal onClick={handleClose}>
      <Modal.Body px={2}>
        <Modal.Header alignItems="center" justifyContent="space-between">
          <Text fontWeight={700} fontSize={3}>
            Edit invite
          </Text>
          <CloseIcon
            onClick={handleClose}
            width={14}
            height={14}
            style={{ cursor: "pointer" }}
          />
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={3}>
            <Text fontSize={1} fontWeight={600} mb={2}>
              Email
            </Text>
            <Flex alignItems="center">
              <Text fontSize={1}>{invite.user_email}</Text>
            </Flex>
          </Box>
          <Flex width={1} flexDirection="column">
            <Text fontSize={1} fontWeight={600} mb={2}>
              Role
            </Text>
            {/* <table>
              <tbody>
                <Row>
                  <Cell>
                    <Label>
                      <Radio
                        checked={"admin" === role}
                        onChange={onChange}
                        name="role"
                        value="admin"
                      />
                    </Label>
                  </Cell>
                  <Cell>
                    <DefaultCellContent>Admin</DefaultCellContent>
                  </Cell>
                  <Cell>
                    For business owners and managers with full control
                  </Cell>
                </Row>
                <Row variant="tiny.default">
                  <Cell mr={1}>
                    <Label>
                      <Radio
                        checked={"member" === role}
                        onChange={onChange}
                        name="role"
                        value="member"
                      />
                    </Label>
                  </Cell>
                  <Cell mr={1}>
                    <DefaultCellContent>Member</DefaultCellContent>
                  </Cell>
                  <Cell>
                    For employees and customer service who manage your store
                  </Cell>
                </Row>
                <Row>
                  <Cell>
                    <Label>
                      <Radio
                        checked={"developer" === role}
                        onChange={onChange}
                        name="role"
                        value="developer"
                      />
                    </Label>
                  </Cell>
                  <Cell>
                    <DefaultCellContent>Delevoper</DefaultCellContent>
                  </Cell>
                  <Cell>
                    For developers who build store functionality and interact
                    with the API
                  </Cell>
                </Row>
              </tbody>
            </table> */}
            <Flex
              width={1}
              flexDirection="column"
              sx={{
                cursor: "pointer",
              }}
              onClick={() => copyInvitation()}
            >
              <CopyToClipboard
                copyText={invitationUrl}
                label={"Invitation link"}
                tooltipText={invitationUrl}
              />
            </Flex>
            <Box mb={1}>
              <Text fontSize={1} mt={3} mb={2} fontWeight={600} mb={2}>
                Resend invitation
              </Text>
              <Button variant="primary" onClick={resendInvite}>
                Resend
              </Button>

              <Text fontSize={1} mt={3} mb={2} fontWeight={600} mb={2}>
                Remove
              </Text>
              <Button variant="delete" onClick={handleDelete}>
                Remove invitation
              </Button>
            </Box>
          </Flex>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button mr={2} variant="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={isLoading} variant="cta" onClick={onSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditInvite