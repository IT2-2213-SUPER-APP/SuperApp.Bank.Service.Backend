import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, CreditCard, Calendar, DollarSign, Receipt } from 'lucide-react';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface Card {
  id: string;
  card_number: string;
  card_holder_name: string;
  balance: number;
  expiry_date: string;
  cvv: string;
}

interface Transaction {
  id: string;
  to_card_number: string;
  amount: number;
  description: string;
  transaction_date: string;
}

export default function Profile() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  useEffect(() => {
    if (selectedCardId) {
      fetchTransactions(selectedCardId);
    }
  }, [selectedCardId]);

  const fetchCustomerData = async () => {
    const { data: customersData, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (customersError) {
      console.error('Error fetching customer:', customersError);
    } else if (customersData) {
      setCustomer(customersData);

      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('customer_id', customersData.id);

      if (cardsError) {
        console.error('Error fetching cards:', cardsError);
      } else {
        setCards(cardsData || []);
        if (cardsData && cardsData.length > 0) {
          setSelectedCardId(cardsData[0].id);
        }
      }
    }

    setLoading(false);
  };

  const fetchTransactions = async (cardId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('from_card_id', cardId)
      .order('transaction_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
    }
  };

  const selectedCard = cards.find(c => c.id === selectedCardId);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg h-100">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">
                <User className="me-2" size={24} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                Customer Information
              </h4>
            </div>
            <div className="card-body">
              {customer ? (
                <div>
                  <div className="mb-3">
                    <strong className="text-muted">Name:</strong>
                    <p className="fs-5 mb-0">{customer.first_name} {customer.last_name}</p>
                  </div>
                  <div className="mb-3">
                    <strong className="text-muted">Email:</strong>
                    <p className="fs-6 mb-0">{customer.email}</p>
                  </div>
                  <div className="mb-3">
                    <strong className="text-muted">Phone:</strong>
                    <p className="fs-6 mb-0">{customer.phone || 'Not provided'}</p>
                  </div>
                  <div className="mb-3">
                    <strong className="text-muted">Member Since:</strong>
                    <p className="fs-6 mb-0">{new Date(customer.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted">No customer data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-lg h-100">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">
                <CreditCard className="me-2" size={24} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                Card Information
              </h4>
            </div>
            <div className="card-body">
              {cards.length > 0 ? (
                <div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Select Card:</label>
                    <select
                      className="form-select"
                      value={selectedCardId}
                      onChange={(e) => setSelectedCardId(e.target.value)}
                    >
                      {cards.map(card => (
                        <option key={card.id} value={card.id}>
                          {card.card_number}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCard && (
                    <div className="border rounded p-4" style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', color: 'white' }}>
                      <div className="mb-3">
                        <small className="opacity-75">Card Number</small>
                        <h5 className="mb-0 letter-spacing">{selectedCard.card_number}</h5>
                      </div>
                      <div className="mb-3">
                        <small className="opacity-75">Card Holder</small>
                        <h6 className="mb-0">{selectedCard.card_holder_name}</h6>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <small className="opacity-75">Expiry Date</small>
                          <p className="mb-0 fw-bold">{selectedCard.expiry_date}</p>
                        </div>
                        <div className="col-6">
                          <small className="opacity-75">CVV</small>
                          <p className="mb-0 fw-bold">{selectedCard.cvv}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-top border-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="opacity-75">Available Balance</span>
                          <h4 className="mb-0">
                            <DollarSign size={24} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                            {selectedCard.balance.toFixed(2)}
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted">No cards available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">
                <Receipt className="me-2" size={24} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                Recent Transactions
              </h4>
            </div>
            <div className="card-body">
              {transactions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>To Card</th>
                        <th>Amount</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td>
                            <Calendar size={16} className="me-1" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                            {new Date(transaction.transaction_date).toLocaleString()}
                          </td>
                          <td>{transaction.to_card_number}</td>
                          <td className="text-danger fw-bold">-${transaction.amount.toFixed(2)}</td>
                          <td>{transaction.description || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">No transactions found for this card</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
