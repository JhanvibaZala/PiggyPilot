import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const EmojiTest = () => {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <button
        onClick={() => setOpen(!open)}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {chosenEmoji ? chosenEmoji : "Pick Emoji"}
      </button>

      {open && (
        <div className="mt-4 border rounded shadow-lg z-50 bg-white w-fit">
          <EmojiPicker
            onEmojiClick={(emojiData, event) => {
              setChosenEmoji(emojiData.emoji);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiTest;
