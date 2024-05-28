import { Dialog, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import { Button } from './nhs';
import { useTranslations } from 'next-intl';

const FeedbackDialog = ({ isOpen, onClose, onSubmit }: {isOpen: any, onClose: any, onSubmit: any}) => {
  const translate = useTranslations('search');
  const [comment, setComment] = useState('');
  const [helpful, setHelpful] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = () => {
    onSubmit({ comment, helpful });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full bg-white p-4 shadow-xl">
              <DialogTitle>Provide Feedback</DialogTitle>
              <textarea
                className="w-full border rounded mt-4 p-2"
                placeholder="Leave a note..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="mt-4">
                <label>
                  <input
                    type="checkbox"
                    checked={helpful}
                    onChange={(e) => setHelpful(e.target.checked)}
                  />
                  Was this helpful?
                </label>
              </div>
              <div className="mt-4">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <Button
                  id='submit'
                  as='a'
                  data-prevent-double-click
                  onClick={handleSubmit}
                  disabled={!!error && comment === ''}
                >
                  {translate('button.submit')}
                </Button>
                <button
                  className="ml-2 p-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default FeedbackDialog;
