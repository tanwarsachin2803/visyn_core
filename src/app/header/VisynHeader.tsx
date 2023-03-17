import { Header, Group, Title, ActionIcon, TextInput, Transition, useMantineTheme, MantineColor, Text, createStyles } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { BurgerButton } from './BurgerButton';
import { DatavisynLogo } from './DatavisynLogo';
import { UserAvatar } from './UserAvatar';
import { useVisynAppContext } from '../VisynAppContext';
import { IAboutAppModalConfig } from './AboutAppModal';
import { ConfigurationMenu } from './ConfigurationMenu';

const HEADER_HEIGHT = 50;

const cardTransition = {
  in: { opacity: 1, width: '200px' },
  out: { opacity: 0, width: '0px' },
  transitionProperty: 'opacity, width',
};

const useStyles = createStyles(() => ({
  a: {
    '& > a': {
      '&:hover': {
        color: 'currentColor',
      },
    },
  },
}));

export function VisynHeader({
  color = 'white',
  backgroundColor = 'gray',
  components,
  undoCallback = null,
  redoCallback = null,
  searchCallback = null,
}: {
  /**
   * Optional color to be used for the background. If it is part of the mantine colors, it uses the primary shade, otherwise it is interpreted as CSS color.
   */
  backgroundColor?: MantineColor;
  /**
   * Optional color to be used for the text. This must be in contrast with the given `backgroundColor`.
   */
  color?: MantineColor;
  /**
   * Extension components to be rendered within the header.
   */
  components?: {
    beforeLeft?: JSX.Element;
    burgerMenu?: JSX.Element;
    afterLeft?: JSX.Element;
    beforeTitle?: JSX.Element;
    title?: JSX.Element;
    afterTitle?: JSX.Element;
    beforeRight?: JSX.Element;
    logo?: JSX.Element;
    userAvatar?: JSX.Element;
    userMenu?: JSX.Element;
    configurationMenu?: JSX.Element;
    afterRight?: JSX.Element;
    aboutAppModal?: JSX.Element | IAboutAppModalConfig;
  };
  /**
   * Optional callback functioned which is called when the undo button is clicked. If not given, undo button is not created
   */
  undoCallback?: () => void;
  /**
   * Optional callback functioned which is called when the redo button is clicked. If not given, redo button is not created
   */
  redoCallback?: () => void;
  /**
   * Optional callback called when the search is changed, passing the current search value. If not given, no search icon is created
   */
  searchCallback?: (s: string) => void;
}) {
  const { appName, user } = useVisynAppContext();
  const theme = useMantineTheme();
  const { classes } = useStyles();

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');

  const onSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(event.currentTarget.value);
      searchCallback(event.currentTarget.value);
    },
    [searchCallback],
  );

  return (
    <Header height={HEADER_HEIGHT} style={{ backgroundColor: theme.colors[backgroundColor][7] || backgroundColor }}>
      <Group
        grow
        sx={{
          height: HEADER_HEIGHT,
          display: 'flex',
          justifyContent: 'space-between',
        }}
        noWrap
      >
        <Group align="center" position="left" noWrap h="100%">
          {components?.beforeLeft}
          {components?.burgerMenu ? <BurgerButton menu={components.burgerMenu} /> : null}
          {undoCallback ? (
            <ActionIcon color={color} variant="transparent" onClick={undoCallback}>
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </ActionIcon>
          ) : null}
          {redoCallback ? (
            <ActionIcon color={color} variant="transparent" onClick={redoCallback}>
              <FontAwesomeIcon icon={faArrowRight} size="lg" />
            </ActionIcon>
          ) : null}
          {searchCallback ? (
            <>
              <ActionIcon color={color} variant="transparent" onClick={() => setIsSearching(!isSearching)}>
                <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
              </ActionIcon>
              <Transition mounted={isSearching} transition={cardTransition} duration={400} timingFunction="ease">
                {(styles) => <TextInput variant="filled" style={styles} placeholder="Search" value={searchString} onChange={onSearch} />}
              </Transition>
            </>
          ) : null}
          {components?.afterLeft}
        </Group>
        <Group align="center" position="center" noWrap>
          {components?.beforeTitle}
          {components?.title === undefined ? (
            <Title className={classes.a} order={3} weight={100} color={color} truncate>
              <Text>{appName}</Text>
            </Title>
          ) : (
            components?.title
          )}
          {components?.afterTitle}
        </Group>

        <Group align="center" position="right" noWrap>
          {components?.beforeRight}
          {components?.logo === undefined ? <DatavisynLogo color={backgroundColor === 'white' ? 'black' : 'white'} /> : components?.logo}
          {components?.userAvatar === undefined ? (
            user ? (
              <UserAvatar menu={components?.userMenu} user={user.name} color={backgroundColor} />
            ) : null
          ) : (
            components?.userAvatar
          )}
          <ConfigurationMenu
            dvLogo={components?.logo === undefined ? <DatavisynLogo color="color" /> : components?.logo}
            menu={components?.configurationMenu}
            aboutAppModal={components?.aboutAppModal}
          />
          {components?.afterRight}
        </Group>
      </Group>
    </Header>
  );
}
