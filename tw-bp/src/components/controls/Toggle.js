/* change to input checkbox */
export function Toggle({ toggle, active }) {
  return (
    <div
      className={`w-16 h-10 rounded-full flex-shrink-0 p-1 ${
        active ? 'bg-positive' : 'bg-gray-300'
      }`}
      onClick={toggle}
    >
      <div
        className={`bg-white w-8 h-8 rounded-full shadow-md transform duration-300 ease-in-out ${
          active ? 'translate-x-6' : ''
        }`}
      ></div>
    </div>
  );
}
