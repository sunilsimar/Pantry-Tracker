'use client'
import { Box, Modal, Stack, TextField, Typography, Button, IconButton, useTheme, Paper,  Fade,
  InputAdornment, Tooltip, Zoom } from "@mui/material";
import {firestore} from "@/firebase"
import {collection, getDocs, query, getDoc, doc, setDoc, deleteDoc} from "firebase/firestore"
import { use, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

export default function Home() {
  const theme = useTheme();
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredInventory, setFilteredInventory] = useState([])


  const updateInventory = async() => {
    const snapshot = query(collection(firestore, "inventory"))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else{
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity === 1){
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
    }
  }
  await updateInventory()
}

const deleteItem = async (item) => {
  const docRef = doc(collection(firestore, "inventory"), item)
  await deleteDoc(docRef)
  await updateInventory()
}

const handleSearch = () => {
  if (searchQuery.trim() === "") {
    setFilteredInventory(inventory);
  } else {
    const filteredItems = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInventory(filteredItems);
  }
}

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#000',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 40, 83, 1) 0%, rgba(4, 12, 24, 1) 90%)',
        py: 6,
        px: { xs: 2, sm: 4, md: 6 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          right: -100,
          bottom: -100,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ bgcolor: 'rgba(0,0,0,0.3)', py: 4, px: 3, position: 'relative', overflow: 'hidden' }}>
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            Inventory Management
          </Typography>
          {/* <InventoryIcon sx={{ position: 'absolute', fontSize: 200, right: -20, bottom: -40, opacity: 0.1, color: 'white' }} /> */}
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }} />
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.05)',
              color: 'white',
              transition: 'all 0.3s',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.1)',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255,255,255,0.5)',
            },
          }}
        />
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleOpen}
              sx={{
                minWidth: 120,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 'bold',
                bgcolor: theme.palette.primary.main,
                color: 'white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Add Item
            </Button>
          </Stack>

          <AnimatePresence>
            {filteredInventory.map(({ id, name, quantity }) => (
              <MotionBox
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'medium', color: 'white' }}>
                  {name}
                </Typography>
                <Typography variant="body1" sx={{ flexGrow: 1, textAlign: { xs: 'left', sm: 'center' }, color: 'rgba(255,255,255,0.7)' }}>
                  Quantity: {quantity}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                  <Tooltip title="Add" arrow TransitionComponent={Zoom}>
                    <IconButton
                      onClick={() => addItem(name)}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        '&:hover': {
                          bgcolor: 'rgba(76, 175, 80, 0.3)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove" arrow TransitionComponent={Zoom}>
                    <IconButton
                      onClick={() => removeItem(name)}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 152, 0, 0.3)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow TransitionComponent={Zoom}>
                    <IconButton
                      onClick={() => deleteItem(name)}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                        '&:hover': {
                          bgcolor: 'rgba(244, 67, 54, 0.3)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </MotionBox>
            ))}
          </AnimatePresence>
        </Box>
      </MotionBox>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Zoom in={open}>
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              p: 4,
              borderRadius: 3,
              maxWidth: 400,
              width: '90%',
              outline: 'none',
            }}
          >
            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
              Add New Item
            </Typography>
            <TextField
              fullWidth
              label="Item Name"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                addItem(itemName);
                handleClose();
              }}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
                bgcolor: theme.palette.primary.main,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Add Item
            </Button>
          </Box>
        </Zoom>
      </Modal>
    </Box>
  );
}
