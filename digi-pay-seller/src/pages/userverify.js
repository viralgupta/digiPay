
const Userverify = ({ name, setAmount, amount, setReason, reason , cancel, confirm }) => {
  return (
    <>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 backdrop-blur-md p-3 rounded-lg z-10 text-white ">
        <div className="flex items-center border p-2 rounded-md border-black mb-1 text-xl">
          UserName:&nbsp;<div className="font-mono font-bold  uppercase">{name}</div>
        </div>
        <div className="flex flex-col items-center border rounded-md border-black text-xl mb-5 p-1">
          <div className="">
            Amount:&nbsp;
            <input onChange={(e) => setAmount(e.target.value)} value={amount} type="number" className="bg-gray-500 rounded-lg h-max py-1" />
          </div>
          <div className="">
            Reason:&nbsp;
            <input onChange={(e) => setReason(e.target.value)} value={reason} type="text" className="bg-gray-500 rounded-lg h-max py-1" />
          </div>
        </div>
        <div className="flex justify-center">
          <button onClick={cancel} className="bg-red-300 p-2 rounded-md border border-black mx-2 text-xl font-bold">Cancel</button>
          <button onClick={confirm} className="bg-green-300 p-2 rounded-md border border-black mx-2 text-xl font-bold">Confirm</button>
        </div>
      </div>
    </>
  )
}

export default Userverify