export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes, you can cancel your Pro subscription anytime. No long-term commitment required.',
  },
  {
    question: 'Can I upgrade or downgrade?',
    answer: 'Of course! You can upgrade to Pro or downgrade to Free at any time.',
  },
  {
    question: 'Do you offer refunds?',
    answer: "We offer a 14-day money-back guarantee if you're not satisfied with Pro Plan.",
  },
];
