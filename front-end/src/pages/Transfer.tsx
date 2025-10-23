import { useState, useEffect } from 'react';
import { CreditCard, Send } from 'lucide-react';
import WalletAPI from '../api/walletAPI';

interface Card {
  wallet_id: string;
  wallet_number: string;
  validity_period: string;
  budget: number;
  cvv: number;
}

export default function Transfer() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [recipientCardNumber, setRecipientCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const data = await WalletAPI.getWallets(1);
      setCards(data.walletArray || []);
    } catch (e) {
      console.log(e);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    // e.preventDefault();
    // setLoading(true);
    // setMessage(null);

    // const transferAmount = parseFloat(amount);
    // if (isNaN(transferAmount) || transferAmount <= 0) {
    //   setMessage({ type: 'error', text: 'Please enter a valid amount' });
    //   setLoading(false);
    //   return;
    // }

    // const senderCard = cards.find(c => c.id === selectedCard);
    // if (!senderCard) {
    //   setMessage({ type: 'error', text: 'Please select a card' });
    //   setLoading(false);
    //   return;
    // }

    // if (senderCard.balance < transferAmount) {
    //   setMessage({ type: 'error', text: 'Insufficient balance' });
    //   setLoading(false);
    //   return;
    // }

    // const { data: recipientCard, error: recipientError } = await supabase
    //   .from('cards')
    //   .select('id, card_number')
    //   .eq('card_number', recipientCardNumber.replace(/\s/g, ''))
    //   .maybeSingle();

    // if (recipientError || !recipientCard) {
    //   setMessage({ type: 'error', text: 'Recipient card not found' });
    //   setLoading(false);
    //   return;
    // }

    // if (recipientCard.id === selectedCard) {
    //   setMessage({ type: 'error', text: 'Cannot transfer to the same card' });
    //   setLoading(false);
    //   return;
    // }

    // const { error: deductError } = await supabase
    //   .from('cards')
    //   .update({ balance: senderCard.balance - transferAmount })
    //   .eq('id', selectedCard);

    // if (deductError) {
    //   setMessage({ type: 'error', text: 'Transfer failed. Please try again.' });
    //   setLoading(false);
    //   return;
    // }

    // const { data: currentRecipientCard } = await supabase
    //   .from('cards')
    //   .select('balance')
    //   .eq('id', recipientCard.id)
    //   .single();

    // const { error: addError } = await supabase
    //   .from('cards')
    //   .update({ balance: (currentRecipientCard?.balance || 0) + transferAmount })
    //   .eq('id', recipientCard.id);

    // if (addError) {
    //   await supabase
    //     .from('cards')
    //     .update({ balance: senderCard.balance })
    //     .eq('id', selectedCard);
    //   setMessage({ type: 'error', text: 'Transfer failed. Please try again.' });
    //   setLoading(false);
    //   return;
    // }

    // const { error: transactionError } = await supabase
    //   .from('transactions')
    //   .insert({
    //     from_card_id: selectedCard,
    //     to_card_number: recipientCardNumber.replace(/\s/g, ''),
    //     amount: transferAmount,
    //     description
    //   });

    // if (transactionError) {
    //   console.error('Error logging transaction:', transactionError);
    // }

    // setMessage({ type: 'success', text: `Successfully transferred $${transferAmount.toFixed(2)}` });
    // setRecipientCardNumber('');
    // setAmount('');
    // setDescription('');
    // fetchCards();
    // setLoading(false);
  };

  const selectedCardData = cards.find(c => c.wallet_id === selectedCard);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-danger text-white">
              <h3 className="mb-0">
                <CreditCard className="me-2" size={28} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                Transfer Money
              </h3>
            </div>
            <div className="card-body p-4">
              {message && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                  {message.text}
                  <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
                </div>
              )}

              <form onSubmit={handleTransfer}>
                <div className="mb-4">
                  <label htmlFor="senderCard" className="form-label fw-bold">From Card</label>
                  <select
                    id="senderCard"
                    className="form-select form-select-lg"
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    required
                  >
                    <option value="">Select your card</option>
                    {cards.map(card => (
                      <option key={card.wallet_id} value={card.wallet_id}>
                        {card.wallet_number} - Balance: ${card.budget.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  {selectedCardData && (
                    <div className="mt-2 text-muted">
                      <small>Available balance: ${selectedCardData.budget.toFixed(2)}</small>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="recipientCard" className="form-label fw-bold">To Card Number</label>
                  <input
                    type="text"
                    id="recipientCard"
                    className="form-control form-control-lg"
                    placeholder="Enter recipient card number"
                    value={recipientCardNumber}
                    onChange={(e) => setRecipientCardNumber(e.target.value)}
                    required
                  />
                </div>

                <textarea id="description" className="description-input">
                </textarea>


                <div className="mb-4">
                  <label htmlFor="amount" className="form-label fw-bold">Amount ($)</label>
                  <input
                    type="number"
                    id="amount"
                    className="form-control form-control-lg"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-danger btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </span>
                  ) : (
                    <span>
                      <Send className="me-2" size={20} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                      Send Money
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
