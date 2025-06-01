import aa1 from './aa1.jpeg';
import aa2 from './aa2.jpeg';
import aa3 from './aa3.jpeg';
import aa4 from './aa4.jpeg';
import aa5 from './aa5.jpeg';
import aa6 from './aa6.jpeg';
import aa7 from './aa7.jpeg';
import aa8 from './aa8.jpeg';
import ff1 from "./ff1.jpeg";
import ff2 from "./ff2.jpeg";
import ff3 from "./ff3.jpeg";
import ff4 from "./ff4.jpeg";
import ff5 from "./ff5.jpeg";
import ff6 from "./ff6.jpeg";
import ff7 from "./ff7.jpeg";
import ff8 from "./ff8.jpeg";
import mm1 from "./mm1.jpg";
import mm2 from "./mm2.jpg";
import mm3 from "./mm3.jpg";
import mm4 from "./mm4.jpg";
import mm5 from "./mm5.jpg";
import mm6 from "./mm6.jpg";
import mm7 from "./mm7.jpg";
import mm8 from "./mm8.jpg";
import set1 from "./set1.jpg";
import set2 from "./set2.jpeg";
import set3 from "./set3.jpeg";
import set4 from "./set4.jpeg";
import set5 from "./set5.jpeg";
import set6 from "./set6.jpeg";
import set7 from "./set7.jpeg";
import set8 from "./set8.jpeg";
import s1 from "./s1.png";
import s2 from "./s2.jpeg";
import s3 from "./s3.jpeg";
import s4 from "./s4.jpeg";
import s5 from "./s5.jpeg";
import s6 from "./s6.jpeg";
import s7 from "./s7.jpeg";
import s8 from "./s8.jpeg";
import s9 from "./s9.jpeg";
import s10 from "./s10.jpeg";
import s11 from "./s11.jpeg";
import s12 from "./s12.png";
import best1 from './best1.jpg';
import best2 from './best2.jpg';
import best3 from './best3.jpg';
import best4 from './best4.jpg';
import best5 from './best5.jpg';
import best6 from './best6.jpg';
import child1 from './child1.jpg';
import child2 from './child2.jpg';
import child3 from './child3.jpg';
import child4 from './child4.jpg';
import child5 from './child5.jpg';
import child6 from './child6.jpg';
import nf1 from './nf1.jpg';
import nf2 from './nf2.jpg';
import nf3 from './nf3.jpg';
import nf4 from './nf4.jpg';
import nf5 from './nf5.jpg';
import nf6 from './nf6.jpg';

const products = [ 
  { id: 'aa1', name: 'NCERT Solutions Physics', author: 'MTG', category: 'Academic & Activity', image: aa1, newPrice: '241', oldPrice: '299' },
  { id: 'aa2', name: 'NCERT Solutions Biology', author: 'Arihant', category: 'Academic & Activity', image: aa2, newPrice: '256', oldPrice: '310' },
  { id: 'aa3', name: 'CBSE Question Bank Class 10 Mathematics', author: 'Oswaal Books', category: 'Academic & Activity', image: aa3, newPrice: '350', oldPrice: '389' },
  { id: 'aa4', name: 'CBSE Question Bank Class 12 Chemistry', author: 'Oswaal Books', category: 'Academic & Activity', image: aa4, newPrice: '365', oldPrice: '380' },
  { id: 'aa5', name: 'Brain Boosting Age Group 4+', author: 'Dreamland', category: 'Academic & Activity', image: aa5, newPrice: '214', oldPrice: '270' },
  { id: 'aa6', name: 'The Brain Fitness Book', author: 'Rita Carter', category: 'Academic & Activity', image: aa6, newPrice: '244', oldPrice: '277' },
    { id: 'aa7', name: '101 Science Experiments', author: 'Om Publishers', category: 'Academic & Activity', image: aa7, newPrice: '220', oldPrice: '297' },
      { id: 'aa8', name: 'My Book of Art and Craft Activity Book 1', author: 'Dreamlook', category: 'Academic & Activity', image: aa8, newPrice: '180', oldPrice: '230' },
      {id: 'ff1', name: 'Fourth Wing', author: 'Rebecca Yarros', category: 'Fantasy & Fiction', image: ff1, newPrice: '345', oldPrice: '467'},
      {id: 'ff2', name: 'A Court of Throns and Roses', author: 'Sarah J. Maas', category: 'Fantasy & Fiction', image: ff2, newPrice: '336', oldPrice: '380'},
      {id: 'ff3', name: 'The Atlas Six', author: 'Olivie Blake', category: 'Fantasy & Fiction', image: ff3, newPrice: '221', oldPrice: '270'},
      {id: 'ff4', name: 'The Starless Sea', author: 'SeaErin Morgenstern', category: 'Fantasy & Fiction', image: ff4, newPrice: '270', oldPrice: '330'},
      {id: 'ff5', name: 'The Invisible Life of Addie Larue', author: 'V. E. Schwab', category: 'Fantasy & Fiction', image: ff5, newPrice: '310', oldPrice: '358'},
      {id: 'ff6', name: 'The Bone Season', author: 'Samantha Shannon', category: 'Fantasy & Fiction', image: ff6, newPrice: '350', oldPrice: '380'},
      {id: 'ff7', name: 'Children of Blood and Bone', author: 'Tomi Adeyemi', category: 'Fantasy & Fiction', image: ff7, newPrice: '290', oldPrice: '340'},
      {id: 'ff8', name: 'The Poppy War', author: 'R. F. Kuang', category: 'Fantasy & Fiction', image: ff8, newPrice: '280', oldPrice: '300'},
      { id: 'set1', name: 'Ram Chandra Series', author: 'Amish', category: 'Box-Set', image: set1, newPrice: '760', oldPrice: '990' },
    { id: 'set2', name: 'Heroes of Olympus', author: 'Rick Riordan' , category: 'Box-Set', image: set2, newPrice: '665', oldPrice: '870' },
    { id: 'set3', name: 'Unusual tales from Indian Mythology', author: 'Sudha Murty', category: 'Box-Set', image: set3, newPrice: '750', oldPrice: '800' },
    { id: 'set4', name: 'The Hidden Hindu', author: 'Akshat Gupta', category: 'Box-Set', image: set4, newPrice: '890', oldPrice: '950' },
    { id: 'set5', name: 'The Best of Sherlock Holmes', author: 'Arthur Conan Doyle', category: 'Box-Set', image: set5, newPrice: '550', oldPrice: '610' },
    { id: 'set6', name: 'The Kalki Trilogy', author: 'Kevin Missal', category: 'Box-Set', image: set6, newPrice: '800', oldPrice: '990' },
    { id: 'set7', name: "World's Greatest Books on Public Speaking", author: 'Dale Carnegie', category: 'Box-Set', image: set7, newPrice: '500', oldPrice: '750' },
    { id: 'set8', name: 'The Shiva Trilogy', author: 'Amish', category: 'Box-Set', image: set8, newPrice: '690', oldPrice: '750' },
    { id: "mm1", name: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", category: "Moral & Motivation", image: mm1, newPrice: "320", oldPrice: "386" },
    { id: "mm2", name: "Atomic Habits", author: "James Clear", category: "Moral & Motivation", image: mm2, newPrice: "220", oldPrice: "259" },
    { id: "mm3", name: "Think like a Monk", author: "Jay Shetty", category: "Moral & Motivation", image: mm3, newPrice: "190", oldPrice: "230" },
    { id: "mm4", name: "Man's Search for Meaning", author: "Viktore E. Frankl", category: "Moral & Motivation", image: mm4, newPrice: "311", oldPrice: "349" },
    { id: "mm5", name: "The Power of Now ", author: "Eckhart Tolle", category: "Moral & Motivation", image: mm5, newPrice: "320", oldPrice: "356" },
    { id: "mm6", name: "You Can Win", author: "Shiv Khera", category: "Moral & Motivation", image: mm6, newPrice: "210", oldPrice: "270" },
    { id: "mm7", name: "The Alchemist", author: "Paulo Coelho", category: "Moral & Motivation", image: mm7, newPrice: "360", oldPrice: "390" },
    { id: "mm8", name: "Wings of Fire", author: "A. P. J. Abdul Kalam", category: "Moral & Motivation", image: mm8, newPrice: "120", oldPrice: "200" },
    { id: "best1", name: "The Psychology of Money", author: "Morgan Housel", category: "Best Seller", image: best1, newPrice: "241", oldPrice: "999" },
    { id: "best2", name: "Atomic Habits", author: "James Clear", category: "Best Seller", image: best2, newPrice: "491", oldPrice: "899" },
    { id: "best3", name: "It Ends with Us", author: "Colleen Hoover", category: "Best Seller", image: best3, newPrice: "301", oldPrice: "1299" },
    { id: "best4", name: "IKIGAI", author: "Héctor García and Francesc Miralles", category: "Best Seller", image: best4, newPrice: "354", oldPrice: "550" },
    { id: "best5", name: "Treasure Island", author: "Robert Louis Stevenson", category: "Best Seller", image: best5, newPrice: "134", oldPrice: "195" },
    { id: "best6", name: "On the Origin of Time", author: "Thomas Hertog", category: "Best Seller", image: best6, newPrice: "603", oldPrice: "799" },
    { id: "child1", name: "The Three Little Pigs", author: "", category: "Children", image: child1, newPrice: "99", oldPrice: "120" },
    { id: "child2", name: "Holes", author: "Louis Sachar", category: "Children", image: child2, newPrice: "425", oldPrice: "899" },
    { id: "child3", name: "Harry Potter and the Chambers of Secrets", author: "J. K. Rowling", category: "Children", image: child3, newPrice: "359", oldPrice: "499" },
    { id: "child4", name: "The Jungle Book", author: "Rudyard Kipling", category: "Children", image: child4, newPrice: "219", oldPrice: "299" },
    { id: "child5", name: "The Wild Robot", author: "Peter Brown", category: "Children", image: child5, newPrice: "257", oldPrice: "499" },
    { id: "child6", name: "Fantastic Mr. Fox", author: "Roald Dahl", category: "Children", image: child6, newPrice: "230", oldPrice: "399" },
    { id: "nf1", name: "Dance of the Furies", author: "Michael S. Neiberg", category: "Non-Fiction", image: nf1, newPrice: "2321", oldPrice: "2391" },
    { id: "nf2", name: "Journalism and Political exclusion", author: "Debra Clark", category: "Non-Fiction", image: nf2, newPrice: "2670", oldPrice: "2771" },
    { id: "nf3", name: "The Corporation that changed the World", author: "Nick Robins", category: "Non-Fiction", image: nf3, newPrice: "1337", oldPrice: "1578" },
    { id: "nf4", name: "The Early Years", author: "Gabriel García Márquez", category: "Non-Fiction", image: nf4, newPrice: "2800", oldPrice: "2999" },
    { id: "nf5", name: "The Art of War", author: "Sun Tzu", category: "Non-Fiction", image: nf5, newPrice: "121", oldPrice: "150" },
    { id: "nf6", name: "Everything is F*cked", author: "Mark Manson", category: "Non-Fiction", image: nf6, newPrice: "271", oldPrice: "343" },
    { id: "s9", name: "Luxor Highlighter", category: "Stationary", image: s9, newPrice: "225", oldPrice: "300" },
    {id: "s8", name: "Faber-Castell 24 Grip Erasable Crayons", category: "Stationary", image: s8, newPrice: "190", oldPrice: "220" },
    { id: "s7", name: "DDNS Waterproof Bag", category: "Stationary", image: s7, newPrice: "450", oldPrice: "600" },
    { id: "s6", name: "Magic Unicorn Water Bottle/Sipper", category: "Stationary", image: s6, newPrice: "170", oldPrice: "200" },
    { id: "s5", name: "Galaxy Pencile Case", category: "Stationary", image: s5, newPrice: "160", oldPrice: "250" },
    { id: "s4", name: "H4 Dark Graphite Pencil Set", category: "Stationary", image: s4, newPrice: "60", oldPrice: "126" },
    { id: "s3", name: "Water Paint Brushes Set of 10", category: "Stationary", image: s3, newPrice: "180", oldPrice: "300" },
    { id: "s2", name: "Notebooks - Set of 6 Notebooks", category: "Stationary", image: s2, newPrice: "180", oldPrice: "300" },
    { id: "s12", name: "3-in-1 Pen Set: Ballpoint, Gel, Fountain", category: "Stationary", image: s12, newPrice: "150", oldPrice: "264" },
    { id: "s11", name: "Stick/Strip Files", category: "Stationary", image: s11, newPrice: "15", oldPrice: "25" },
    { id: "s10", name: "Fevicol - Set of 10", category: "Stationary", image: s10, newPrice: "180", oldPrice: "299" },
    { id: "s1", name: "Scissors", category: "Stationary", image: s1, newPrice: "50", oldPrice: "100" },
  ];

export default products;