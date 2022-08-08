import { useEffect } from "react"
import { useState } from "react"
import Button from "react-bootstrap/esm/Button"


const UserTableItem = (props) => {
    const {user, handleEditModal} = props
    const [userGroups, setUserGroups] = useState('')

    useEffect(() => {
        if(user.groups) {
            let userGroupString = '';
            userGroupString = user.groups.forEach(group => {userGroupString += ` ${group.name} `
            setUserGroups(userGroupString)
    })}
    }, [user])

    const handleEdit = () => {
        handleEditModal(user)
    }

    return (
        <tr>
        <th>{user.id}</th>
        <th>{user.username}</th>
        <th>{user.email}</th>
        <th>{user.role}</th>
        <th>{userGroups}</th>
        <th>{user.isActive === '1' ? 'Enabled' : 'Disabled'}</th>
        <th ><Button onClick={handleEdit} variant="primary">Edit</Button></th>
      </tr>
    )
}

export default UserTableItem;