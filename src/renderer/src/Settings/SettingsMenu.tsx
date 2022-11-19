import {
  updateFormField,
  setForm,
  restrictValue,
  updateBorderStyle,
  searchAppDB,
  getSearchResults,
  addApp,
  getRelevantApps,
  updateSettingData,
  form,
} from '../settings';
import {
  SimpleSelect,
  SimpleOption,
  Box,
  Grid,
  GridItem,
  Divider,
  css,
  Radio,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Switch,
  createDisclosure,
  Center,
} from '@hope-ui/solid';

import { HStack, Tabs, TabList, Tab, TabPanel, VStack } from '@hope-ui/solid';
import { createSignal, For, Show } from 'solid-js';

import '../../assets/settings.css';

const SettingsMenu = () => {
  const tabStyles = css({
    width: '100px',
    height: '30px',
    marginTop: '7px',
    '&:hover': {
      hover: '#C5CBFE !important',
      boxShadow: '#C5CBFE !important',
      outlineColor: '#C5CBFE !important',
      color: '#414141 !important',
    },
    '&:focus': {
      background: '#C5CBFE !important',
      hover: '#C5CBFE !important',
      boxShadow: '#C5CBFE !important',
      outlineColor: '#C5CBFE !important',
      color: '#414141 !important',
    },
    '&[aria-selected=true]': {
      background: '#C5CBFE !important',
      boxShadow: '#C5CBFE !important',
      hover: '#C5CBFE !important',
      outlineColor: '#C5CBFE !important',
      color: '#414141 !important',
    },
  });

  const { isOpen, onOpen, onClose } = createDisclosure();

  const [getPage, setPage] = createSignal<number>(0);

  let searchBar: HTMLInputElement | undefined;

  return (
    <>
      <Grid
        h="100%"
        templateRows="repeat(, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap="$4"
        onDrop={async (e: DragEvent) => {
          e.preventDefault();
          if (e?.dataTransfer?.files[0]?.path) {
            console.log(await addApp(e.dataTransfer.files[0].path));
          }
          // console.log(e.dataTransfer.files[0].path);
        }}
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          if (e?.dataTransfer?.dropEffect) {
            e.dataTransfer.dropEffect = 'copy';
          }
          return false;
        }}
      >
        <GridItem>
          <VStack alignItems="left" spacing="$4">
            <Tabs keepAlive variant="pills" defaultIndex={1}>
              <TabList borderWidth="1px" borderColor="$neutral6">
                <h1 class="pl-3">Settings</h1>
                <Tab class={tabStyles()}>Appearance</Tab>
                <Tab class={tabStyles()}>Layout</Tab>
                <Tab class={tabStyles()}>Preferences</Tab>
              </TabList>
              <Divider class="pb-2" />

              <TabPanel id="tp_appearance">
                <p>Theme Selection</p>
                <Box w="100%" pt="50px" pb="50px">
                  {' '}
                  <HStack spacing="$4">
                    <Radio defaultChecked colorScheme="primary" />
                    <Radio defaultChecked colorScheme="accent" />
                    <Radio defaultChecked colorScheme="neutral" />
                  </HStack>
                </Box>
                <Grid
                  h="100%"
                  templateRows="repeat(2, 1fr)"
                  templateColumns="repeat(2, 1fr)"
                  gap="$4"
                >
                  <GridItem>
                    <p>Custom Themes</p>
                    <p>Create your own Theme</p>
                  </GridItem>
                  <GridItem
                    class="justify-end flex items-end"
                    rowStart={1}
                    rowEnd={1}
                    colStart={2}
                    colEnd={2}
                  >
                    <Button bg="lightgray !important" onClick={onOpen}>
                      +
                    </Button>
                    <Modal opened={isOpen()} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalCloseButton />
                        <ModalHeader>Modal Title</ModalHeader>
                        <ModalBody>
                          <p>Some contents...</p>
                        </ModalBody>
                        <ModalFooter>
                          <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </GridItem>
                  <GridItem
                    rowStart={2}
                    rowEnd={2}
                    colStart={2}
                    colEnd={2}
                    style="align-self: flex-end;"
                  >
                    <p>Border Width</p>
                    <InputGroup size="xs">
                      <Input
                        type="number"
                        max="50"
                        min="0"
                        onInput={(e: Event) => {
                          restrictValue(e), updateFormField('borderWidth')(e);
                        }}
                        placeholder="0"
                      />
                      <InputRightElement pointerEvents="none">px</InputRightElement>
                    </InputGroup>
                    <p>Border Style</p>
                    <SimpleSelect
                      size="xs"
                      id="borderStyle"
                      placeholder="none"
                      onChange={(e: Event) => {
                        updateBorderStyle(e);
                      }}
                    >
                      <SimpleOption value="solid">solid</SimpleOption>
                      <SimpleOption value="double">double</SimpleOption>
                    </SimpleSelect>
                  </GridItem>
                  <GridItem rowStart={2} rowEnd={2} colStart={1} colEnd={1} h="100%">
                    <p>Hexagon</p>
                    <p>Width</p>
                    <InputGroup size="xs">
                      <Input
                        type="number"
                        max="50"
                        min="0"
                        onInput={(e: Event) => {
                          restrictValue(e), updateFormField('width')(e);
                        }}
                        placeholder="0"
                      />
                      <InputRightElement pointerEvents="none">px</InputRightElement>
                    </InputGroup>
                    <p>Border Radius</p>
                    <InputGroup size="xs">
                      <Input
                        type="number"
                        max="50"
                        min="0"
                        onInput={(e: Event) => {
                          restrictValue(e), updateFormField('borderRadius')(e);
                        }}
                        placeholder="0"
                      />
                      <InputRightElement pointerEvents="none">px</InputRightElement>
                    </InputGroup>
                  </GridItem>
                </Grid>
              </TabPanel>

              <TabPanel id="tp_layout">
                <p>Assets</p>
                <p>Drag & drop</p>

                <Input
                  bg="#C3C2C2"
                  ref={searchBar}
                  onInput={(e) => {
                    searchAppDB((e.target as HTMLInputElement).value);
                    setPage(0);
                  }}
                ></Input>
                <br></br>
                <br></br>

                <p>Apps</p>
                <ul>
                  <For each={getSearchResults()?.hits ?? []}>
                    {(res) => (
                      <>
                        <Box
                          class="my-2 p-2 bg-slate-300"
                          borderRadius="$lg"
                          onClick={() => {
                            if (searchBar) {
                              if (searchBar.value.match(/^([a-z]:)?(\/|\\).*/gi)) {
                                const newPath =
                                  res.document.executable.replaceAll('\\', '/') +
                                  (res.document.type === 'Folder' ? '/' : '');
                                searchBar.value = newPath;

                                searchAppDB(newPath);
                                setPage(0);
                                searchBar.focus();
                              }
                            }
                          }}
                        >
                          <li>
                            <HStack>
                              <img src={res.document.icon} class="w-10 pr-2"></img>
                              <div>
                                <strong>{res.document.name}</strong>
                                <br />
                                <em>{res.document.executable}</em>{' '}
                              </div>
                            </HStack>
                          </li>
                        </Box>
                      </>
                    )}
                  </For>
                </ul>
                <Show when={(getSearchResults()?.hits?.length ?? 0) > 0}>
                  <Center>
                    <button
                      class="bg-blue-300 rounded-sm px-2 py-1 m-2"
                      onClick={() => {
                        if (searchBar?.value !== '' && getPage() > 0) {
                          setPage((page) => page - 1);
                          searchAppDB(searchBar?.value ?? '', getPage() * 10);
                        }
                      }}
                    >
                      Prev
                    </button>
                    <span>{getPage() + 1}</span>
                    <button
                      class="bg-blue-300 rounded-sm px-2 py-1 m-2"
                      onClick={() => {
                        console.log(getSearchResults()?.count);
                        if (
                          searchBar?.value !== '' &&
                          (getSearchResults()?.count ?? 0) > (getPage() + 1) * 10
                        ) {
                          setPage((page) => page + 1);
                          searchAppDB(searchBar?.value ?? '', getPage() * 10);
                        }
                      }}
                    >
                      Next
                    </button>
                  </Center>
                </Show>
                <Box bg="#C3C2C2" minH="200px" borderRadius="$lg">
                  <ul class="p-1">
                    <For each={getRelevantApps() ?? []}>
                      {(res) => (
                        <>
                          <Box class="my-2 p-2 bg-slate-300" borderRadius="$lg">
                            <li>
                              <HStack>
                                <img src={res.icon} class="w-10 pr-2"></img>
                                <div>
                                  <strong>{res.name}</strong>
                                  <br />
                                  <em>{res.executable}</em>{' '}
                                </div>
                              </HStack>
                            </li>
                          </Box>
                        </>
                      )}
                    </For>
                  </ul>
                </Box>
                <p>Actions</p>
                <Box bg="#C3C2C2" h="200px" borderRadius="$lg"></Box>
              </TabPanel>

              <TabPanel id="tp_preferences">
                <p>Start Hotkey</p>

                <InputGroup id="hello" class="w-40">
                  <Input size="xs" placeholder="STRG" />
                  <Input size="xs" placeholder="K" />
                </InputGroup>
                <br></br>
                <Grid
                  h="100%"
                  templateRows="repeat(, 1fr)"
                  templateColumns="repeat(2, 1fr)"
                  gap="$1"
                >
                  <p>Navigation via keyboard</p>{' '}
                  <GridItem class="flex justify-end">
                    <Switch
                      onChange={() => {
                        setForm({
                          keyboardNavigation: !form.keyboardNavigation,
                        }),
                          updateSettingData();
                      }}
                      class="flex-end"
                      defaultChecked
                    ></Switch>
                  </GridItem>
                </Grid>
                <p>Navigation through the Application with your Keyboard</p>
                <br></br>
                <Grid
                  h="100%"
                  templateRows="repeat(, 1fr)"
                  templateColumns="repeat(2, 1fr)"
                  gap="$1"
                >
                  <p>Full Layout</p>
                  <GridItem class="flex justify-end">
                    <Switch
                      onChange={() => {
                        setForm({
                          fullLayout: !form.fullLayout,
                        }),
                          updateSettingData();
                      }}
                      class="flex-end"
                      defaultChecked
                    ></Switch>
                  </GridItem>
                </Grid>
                <p>
                  Always show all the available Hexagons, even when they are empty Filled Hexagons
                  don't need to be attached to another anymore
                </p>
                <br></br>
                <Grid
                  h="100%"
                  templateRows="repeat(, 1fr)"
                  templateColumns="repeat(2, 1fr)"
                  gap="$1"
                >
                  <h2>Move to Cursor</h2>
                  <GridItem class="flex justify-end">
                    <Switch
                      onChange={() => {
                        setForm({
                          moveToCursor: !form.moveToCursor,
                        }),
                          updateSettingData();
                      }}
                      class="flex-end"
                      defaultChecked
                    ></Switch>
                  </GridItem>
                </Grid>
                <p>
                  The Layout will open where your mouse is located when you open the Application
                </p>
              </TabPanel>
            </Tabs>
          </VStack>
        </GridItem>
        <GridItem rowSpan={2} colSpan={2} bg="#EAEAEA" h="100%"></GridItem>
      </Grid>
    </>
  );
};

export default SettingsMenu;
