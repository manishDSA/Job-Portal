import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/Redux/jobSlice';

const fitlerData = [
  {
    fitlerType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
  },
  {
    fitlerType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },
  {
    fitlerType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
  },
]
const FilterCard = () => {

//   const [selectedValue, setSelectedValue] = useState('');
//  const dispatch= useDispatch()
//   const ChangeHandler = (value) => {
//     setSelectedValue(value)
//   }
//   useEffect(() => {
//     dispatch(setSearchedQuery(selectedValue))
//   }, [selectedValue])
const [selectedValue, setSelectedValue] = useState('');
const dispatch = useDispatch();
const changeHandler = (value) => {
    setSelectedValue(value);
}
useEffect(()=>{
    dispatch(setSearchedQuery(selectedValue));
},[selectedValue]);
  return (
    <div className='w-full bg-white p-3 rounded-xl'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className='mt-3' />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {
          fitlerData.map((item, index) => (
            <div>
              <h1 className='font-bold text-lg'>{item.fitlerType}</h1>
              {
                item.array.map((data, idx) => {
                   const itemId = `id${index}-${idx}`
                  return (

                    <div  className='flex items-center space-x-2 my-2'>
                      <RadioGroupItem value={data} id={itemId} />
                      <Label htmlFor={itemId}>{data}</Label>
                    </div>
                  )

                })
              }
            </div>
          ))
        }
      </RadioGroup>
    </div>
  );
}

export default FilterCard;
