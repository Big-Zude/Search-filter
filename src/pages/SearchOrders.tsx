import React, { useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { FilterList } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { orders } from '../utils/Orders';
import { columns } from '../utils/Columns';

function SearchOrders() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orderFilter, setOrderFilter] = useState<string[]>([]);
  const [itemFilter, setItemFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  console.log('xxx', searchTerm);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(!true);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value as string);
  };

  const handleRest = () => {
    setOrderFilter([]);
    setItemFilter([]);
    setSearchTerm('');
    setTypeFilter('');
  };

  const itemFilterString = Array.isArray(itemFilter)
    ? itemFilter.join('')
    : itemFilter;
  const orderFilterString = Array.isArray(orderFilter)
    ? orderFilter.join('')
    : orderFilter;

  const filteredOrders = orders.filter((order) => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    const itemLowerCase = order.item.toLowerCase();
    const orderLowerCase = order.order.toLowerCase();
    const typeLowerCase = order.type.toLowerCase();

    return (
      (itemFilterString === '' ||
        itemLowerCase.includes(itemFilterString.toLowerCase())) &&
      (orderFilterString === '' ||
        orderLowerCase.includes(orderFilterString.toLowerCase())) &&
      (typeFilter === '' || typeLowerCase.includes(typeFilter.toLowerCase())) &&
      itemLowerCase.includes(searchTermLowerCase) &&
      orderLowerCase.includes(orderLowerCase) &&
      typeLowerCase.includes(typeLowerCase)
    );
  });

  const isNumberKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignContent: 'flex-end',
          marginBottom: 10,
          justifyContent: 'flex-end'
        }}
      >
        <Input
          id="search-input"
          placeholder="Search"
          type="search"
          size="small"
          style={{
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginRight: '8px',
            width: '26%'
          }}
          onKeyPress={isNumberKey}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
        />
        <IconButton size="large" id="filter-button" onClick={handleOpen}>
          <FilterList />
        </IconButton>
      </div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Filter Orders</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: '50%' }}>
            <FormControl fullWidth>
              <Autocomplete
                disablePortal
                multiple
                id="item-autocomplete"
                options={filteredOrders}
                getOptionLabel={(option) => option.item}
                onChange={(event, newValue) => {
                  setItemFilter(newValue.map((option) => option.item));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Item No." />
                )}
              />
              <Autocomplete
                disablePortal
                multiple
                id="orders-autocomplete"
                options={filteredOrders}
                getOptionLabel={(option) => option.order}
                onChange={(event, newValue) => {
                  setOrderFilter(newValue.map((option) => option.order));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Order No." />
                )}
                sx={{ marginTop: 2, marginBottom: 2 }}
              />
              <Select
                labelId="demo-simple-select-label"
                id="select-type"
                value={typeFilter}
                label="Type"
                placeholder="Type"
                onChange={handleTypeChange}
              >
                <MenuItem value="EDF">EDF</MenuItem>
                <MenuItem value="CAO">CAO</MenuItem>
                <MenuItem value="SFO">SFO</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              handleRest();
            }}
          >
            Clear
          </Button>
          <Button variant="contained" onClick={handleClose} color="primary">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
      <MUIDataTable
        title={''}
        data={filteredOrders}
        columns={columns}
        options={{
          elevation: 2,
          enableNestedDataAccess: '.',
          selectableRows: 'none',
          responsive: 'simple',
          filter: false,
          download: false,
          print: false,
          search: false,
          viewColumns: false
        }}
      />
    </div>
  );
}

export default SearchOrders;
