import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/Redux/jobSlice';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"]
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science", "DevOps"]
  },
  {
    filterType: "Salary",
    array: ["0 - 5 LPA", "5 - 10 LPA", "10 - 20 LPA", "20+ LPA"]
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  // Sync with redux store if reset externally
  useEffect(() => {
    if (!searchedQuery) {
      setSelectedValue('');
    }
  }, [searchedQuery]);

  const handleReset = () => {
    setSelectedValue('');
    dispatch(setSearchedQuery(''));
  };

  return (
    <div className='w-full bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex items-center justify-between'>
        <h1 className='font-bold text-lg text-gray-800'>Filter Jobs</h1>
        {selectedValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className='text-xs text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1 h-8 px-2 rounded-lg'
          >
            <RotateCcw className='w-3.5 h-3.5' />
            Reset
          </Button>
        )}
      </div>
      <hr className='mt-3 mb-4 border-gray-200' />
      
      <RadioGroup value={selectedValue} onValueChange={changeHandler} className='space-y-4'>
        {filterData.map((item, index) => (
          <div key={index} className='space-y-2'>
            <h2 className='font-semibold text-sm text-gray-700 uppercase tracking-wider'>{item.filterType}</h2>
            <div className='space-y-1.5 pl-1'>
              {item.array.map((data, idx) => {
                const itemId = `filter-${index}-${idx}`;
                return (
                  <div key={itemId} className='flex items-center space-x-2 py-1'>
                    <RadioGroupItem
                      value={data}
                      id={itemId}
                      className="border-gray-400 text-indigo-600 focus:ring-indigo-600"
                    />
                    <Label
                      htmlFor={itemId}
                      className='text-sm text-gray-600 cursor-pointer hover:text-gray-900 select-none'
                    >
                      {data}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
