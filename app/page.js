"use client";
import { useState, useEffect, useRef } from "react";
import { firestore } from "@/firebase";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  getDoc,
  setDoc,
  where,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const camera = useRef(null);
  const [image, setImage] = useState(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") return;

    const q = query(
      collection(firestore, "inventory"),
      where("__name__", ">=", searchTerm),
      where("__name__", "<=", searchTerm + "\uf8ff"),
    );

    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    console.log(items);
    setInventory(items);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Link
        key="camera"
        href="/camera"
        className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      >
        <p className="hidden md:block">Camera</p>
      </Link>

      <Modal>
        <Box></Box>
      </Modal>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box>
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
          borderRadius={10}
          marginY={2}
        >
          <Typography variant="h3">Inventory Items</Typography>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<AddIcon />}
            onClick={() => {
              handleOpen();
            }}
          >
            Add Item
          </Button>
        </Box>
        <form onSubmit={handleSearch}>
          <Stack direction="row" spacing={2} marginY={2}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              margin="normal"
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Stack>
        </form>
        <Stack width="800px" height="300px" overflow="auto">
          <Grid container spacing={2}>
            {inventory.map(({ name, quantity }) => (
              <Grid item xs={4} key={name}>
                <Box
                  width="100%"
                  minHeight="150px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="#f0f0f0"
                  padding={5}
                  borderRadius={10}
                >
                  <Typography variant="h4" color="#333">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>

                  <Stack direction="row" spacing={2}>
                    <IconButton
                      color="primary"
                      aria-label="add an alarm"
                      variant="contained"
                      onClick={() => {
                        addItem(name);
                      }}
                    >
                      <AddCircleIcon fontSize="large" />
                    </IconButton>

                    <Typography variant="h4" color="#333">
                      {quantity}
                    </Typography>
                    <IconButton
                      color="primary"
                      aria-label="add an alarm"
                      variant="contained"
                      onClick={() => {
                        removeItem(name);
                      }}
                    >
                      <RemoveCircleIcon fontSize="large" />
                    </IconButton>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
}
