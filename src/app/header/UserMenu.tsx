import { Avatar, createStyles, Menu } from '@mantine/core';
import React from 'react';
import { LoginUtils } from '../../security';

export function UserMenu({ menu, user, color }: { menu: JSX.Element; user: string; color: string }) {
  const useStyles = createStyles(() => ({
    avatar: {
      cursor: 'pointer',
      '> div': {
        fontSize: '12.5px',
      },
    },
  }));

  const { classes } = useStyles();

  return (
    <Menu shadow="md" data-testid="visyn-user-avatar">
      <Menu.Target>
        <Avatar className={classes.avatar} role="button" color={color} radius="xl" size={28}>
          {user
            .split(' ')
            .map((name) => name[0])
            .slice(0, 3)
            .join('')
            .toUpperCase()}
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <>
          <Menu.Label>Logged in as {user}</Menu.Label>
          {menu ? (
            <>
              {menu}
              <Menu.Divider />
            </>
          ) : null}
          <Menu.Item
            onClick={() => {
              LoginUtils.logout();
            }}
          >
            Logout
          </Menu.Item>
        </>
      </Menu.Dropdown>
    </Menu>
  );
}
