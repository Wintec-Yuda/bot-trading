import { setParams } from '@/lib/redux/slices/backtestSlice';
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const DateFormBacktesting = () => {
  const dispatch = useDispatch();
  const params = useSelector((state) => state.backtest.params);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    dispatch(setParams({ [name]: value }));
  };

  return (
    <Fragment>
      <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={params.startDate || ""}
              onChange={handleDateChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={params.endDate || ""}
              onChange={handleDateChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            />
          </div>
    </Fragment>
  )
}

export default DateFormBacktesting