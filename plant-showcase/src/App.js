import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Leaf, Search, Droplet, Sun, Wind, Thermometer, Info, X, ChevronLeft, ChevronRight, Calendar, Star, AlertCircle, Shuffle, ArrowUpDown, Moon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const plants = [
  { id: 1, name: 'Monstera Deliciosa', care: 'Medium water, bright indirect light', color: 'from-green-400 to-blue-500', icon: '🌿', waterNeeds: 2, lightNeeds: 3, humidity: 60, temperature: '18-30', description: 'Known for its large, glossy leaves with natural holes, the Monstera is a statement piece in any room.', difficulty: 'Intermediate', lastWatered: '2023-05-10', rating: 4.5 },
  { id: 2, name: 'Snake Plant', care: 'Low water, low to bright indirect light', color: 'from-yellow-400 to-green-500', icon: '🐍', waterNeeds: 1, lightNeeds: 2, humidity: 40, temperature: '15-27', description: 'A hardy plant that can survive in various light conditions and helps purify the air.', difficulty: 'Easy', lastWatered: '2023-05-05', rating: 4.8 },
  { id: 3, name: 'Fiddle Leaf Fig', care: 'Medium water, bright indirect light', color: 'from-blue-400 to-purple-500', icon: '🌳', waterNeeds: 2, lightNeeds: 3, humidity: 50, temperature: '18-24', description: 'With its large, violin-shaped leaves, this plant adds a touch of drama to any space.', difficulty: 'Advanced', lastWatered: '2023-05-08', rating: 4.2 },
  { id: 4, name: 'Pothos', care: 'Low to medium water, low to bright indirect light', color: 'from-purple-400 to-pink-500', icon: '🍃', waterNeeds: 1, lightNeeds: 2, humidity: 50, temperature: '18-29', description: 'A versatile trailing plant that\'s perfect for beginners and can thrive in various conditions.', difficulty: 'Easy', lastWatered: '2023-05-07', rating: 4.9 },
  { id: 5, name: 'ZZ Plant', care: 'Low water, low to bright indirect light', color: 'from-pink-400 to-red-500', icon: '🌱', waterNeeds: 1, lightNeeds: 1, humidity: 40, temperature: '18-26', description: 'Known for its ability to tolerate neglect, the ZZ plant is perfect for those who often forget to water.', difficulty: 'Easy', lastWatered: '2023-05-01', rating: 4.7 },
  { id: 6, name: 'Peace Lily', care: 'Medium water, low to medium light', color: 'from-indigo-400 to-blue-500', icon: '✌️', waterNeeds: 2, lightNeeds: 2, humidity: 50, temperature: '18-30', description: 'With its elegant white flowers, the Peace Lily is both beautiful and excellent at purifying air.', difficulty: 'Intermediate', lastWatered: '2023-05-09', rating: 4.6 },
];

const ProgressBar = ({ value, max, color }) => {
  const springValue = useSpring(value);

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <motion.div 
        className={`h-2.5 rounded-full ${color}`} 
        style={{ width: springValue.to(v => `${(v / max) * 100}%`) }}
      ></motion.div>
    </div>
  );
};

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <Star
            size={16}
            className={i < fullStars ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        </motion.div>
      ))}
      {hasHalfStar && (
        <motion.div 
          className="relative -ml-4"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Star size={16} className="text-gray-300" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star size={16} className="text-yellow-400 fill-current" />
          </div>
        </motion.div>
      )}
      <motion.span 
        className="ml-2 text-sm text-gray-600"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        {rating.toFixed(1)}
      </motion.span>
    </div>
  );
};

const PlantCard = React.memo(({ plant, onClick, isVisible }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0, scale: 1, rotateY: 0 });
    }
  }, [inView, controls]);

  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: -15 }}
      animate={controls}
      whileHover={{ scale: 1.05, rotateY: 5, zIndex: 1 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative perspective"
    >
      <motion.div
        className={`bg-gradient-to-br ${plant.color} p-6 rounded-2xl shadow-lg cursor-pointer overflow-hidden transform transition-all duration-300 hover:shadow-2xl`}
        onClick={() => onClick(plant)}
        animate={hovered ? { y: -5 } : { y: 0 }}
      >
        <motion.div
          className="absolute top-2 right-2 text-4xl"
          animate={{ rotate: hovered ? [0, 10, 0] : 0 }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          {plant.icon}
        </motion.div>
        <motion.h2 
          className="text-2xl font-bold mb-2 text-white drop-shadow-md"
          animate={hovered ? { scale: 1.1 } : { scale: 1 }}
        >
          {plant.name}
        </motion.h2>
        <motion.p 
          className="text-white text-opacity-80 mb-2"
          animate={hovered ? { opacity: 1 } : { opacity: 0.8 }}
        >
          {plant.care}
        </motion.p>
        <div className="flex justify-between items-center">
          <motion.span 
            className="text-white text-opacity-90 text-sm"
            animate={hovered ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}
          >
            {plant.difficulty}
          </motion.span>
          <StarRating rating={plant.rating} />
        </div>
      </motion.div>
    </motion.div>
  );
});

const PlantModal = ({ plant, onClose, onPrevious, onNext }) => {
  const [activeTab, setActiveTab] = useState('info');
  const x = useSpring(0, { stiffness: 100, damping: 30 });
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  const tabs = [
    { id: 'info', icon: <Info size={20} /> },
    { id: 'care', icon: <Leaf size={20} /> },
    { id: 'stats', icon: <AlertCircle size={20} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          if (Math.abs(info.offset.x) > 100) {
            onClose();
          }
        }}
        style={{ x, opacity }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white rounded-2xl max-w-md w-full p-8 relative overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${plant.color} opacity-20`}></div>
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={24} />
        </motion.button>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center mb-6"
        >
          <motion.span 
            className="text-6xl mr-4"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            {plant.icon}
          </motion.span>
          <div>
            <motion.h2 
              className="text-3xl font-bold relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {plant.name}
            </motion.h2>
            <motion.p 
              className="text-sm text-gray-600"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {plant.difficulty}
            </motion.p>
          </div>
        </motion.div>
        
        <div className="flex mb-4 space-x-2">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-full transition-colors duration-200 ${
                activeTab === tab.id
                  ? `bg-${plant.color.split('-')[1]} text-white`
                  : 'bg-gray-200 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center justify-center">
                {tab.icon}
                <span className="ml-2 capitalize">{tab.id}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mb-4 text-gray-600">{plant.description}</p>
              <div className="flex justify-between items-center mb-4">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Wind className="text-blue-500 mr-2" />
                  <span>Humidity: {plant.humidity}%</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Thermometer className="text-red-500 mr-2" />
                  <span>Temp: {plant.temperature}°C</span>
                </motion.div>
              </div>
              <div className="mt-4">
                <StarRating rating={plant.rating} />
              </div>
            </motion.div>
          )}
          {activeTab === 'care' && (
            <motion.div
              key="care"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-blue-700 dark:text-white">Water Needs</span>
                    <span className="text-sm font-medium text-blue-700 dark:text-white">{plant.waterNeeds}/3</span>
                  </div>
                  <ProgressBar value={plant.waterNeeds} max={3} color="bg-blue-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-yellow-700 dark:text-white">Light Needs</span>
                    <span className="text-sm font-medium text-yellow-700 dark:text-white">{plant.lightNeeds}/3</span>
                  </div>
                  <ProgressBar value={plant.lightNeeds} max={3} color="bg-yellow-400" />
                </div>
              </div>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {plant.care}
              </motion.p>
            </motion.div>
          )}
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center justify-between"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-semibold">{plant.difficulty}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-gray-600">Last Watered:</span>
                  <span className="font-semibold flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {plant.lastWatered}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-gray-600">Rating:</span>
                  <StarRating rating={plant.rating} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-between mt-6">
          <motion.button 
            onClick={onPrevious} 
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button 
            onClick={onNext} 
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MovingBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const springConfig = { stiffness: 100, damping: 30 };
  const x = useSpring(mousePosition.x, springConfig);
  const y = useSpring(mousePosition.y, springConfig);

  return (
    <motion.div
      className="fixed inset-0 z-[-1]"
      style={{
        background: useMotionTemplate`
          radial-gradient(600px at ${x}px ${y}px, rgba(29, 78, 216, 0.15), transparent 80%)
        `,
      }}
    />
  );
};

const App = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePlants, setVisiblePlants] = useState([]);
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [theme, setTheme] = useState('light');
  const plantRefs = useRef([]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredPlants = useMemo(() => 
    plants.filter((plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDifficulty === 'All' || plant.difficulty === filterDifficulty)
    ),
    [searchTerm, filterDifficulty]
  );

  const sortedAndFilteredPlants = useMemo(() => {
    let result = filteredPlants.slice();
    result.sort((a, b) => {
      if (a[sortCriteria] < b[sortCriteria]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortCriteria] > b[sortCriteria]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [filteredPlants, sortCriteria, sortOrder]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisiblePlants((prev) => [...prev, entry.target.dataset.plantId]);
          }
        });
      },
      { threshold: 0.1 }
    );

    plantRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      plantRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [sortedAndFilteredPlants]);

  const handlePreviousPlant = () => {
    const currentIndex = plants.findIndex(p => p.id === selectedPlant.id);
    const previousIndex = (currentIndex - 1 + plants.length) % plants.length;
    setSelectedPlant(plants[previousIndex]);
  };

  const handleNextPlant = () => {
    const currentIndex = plants.findIndex(p => p.id === selectedPlant.id);
    const nextIndex = (currentIndex + 1) % plants.length;
    setSelectedPlant(plants[nextIndex]);
  };

  const shufflePlants = () => {
    const shuffled = [...sortedAndFilteredPlants].sort(() => Math.random() - 0.5);
    setVisiblePlants([]);
    setSortCriteria('random');
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-br from-green-100 via-blue-100 to-purple-100' : 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'} p-8 relative overflow-hidden transition-colors duration-500`}>
      <MovingBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className={`text-6xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r ${theme === 'light' ? 'from-green-600 via-blue-600 to-purple-600' : 'from-green-400 via-blue-400 to-purple-400'}`}
        >
          Botanical Haven
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
          className="max-w-4xl mx-auto mb-12 relative"
        >
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search plants..."
              className={`w-full p-4 pr-12 rounded-full border-2 ${theme === 'light' ? 'border-green-300 focus:ring-green-400' : 'border-green-700 focus:ring-green-600'} focus:outline-none focus:ring-2 transition-all duration-300 bg-opacity-80 backdrop-blur-sm ${theme === 'light' ? 'bg-white' : 'bg-gray-800 text-white'}`}
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-green-500' : 'text-green-400'}`} />
          </div>
          <div className="flex justify-center space-x-4 mb-4">
            {['All', 'Easy', 'Intermediate', 'Advanced'].map((difficulty) => (
              <motion.button
                key={difficulty}
                onClick={() => setFilterDifficulty(difficulty)}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  filterDifficulty === difficulty
                    ? `bg-gradient-to-r ${theme === 'light' ? 'from-green-500 to-blue-500' : 'from-green-600 to-blue-600'} text-white`
                    : `${theme === 'light' ? 'bg-white text-green-500 hover:bg-green-100' : 'bg-gray-800 text-green-400 hover:bg-gray-700'}`
                }`}
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                {difficulty}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-center space-x-4">
            <motion.select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
              className={`p-2 rounded-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800 text-white'}`}
              whileHover={{ scale: 1.05 }}
            >
              <option value="name">Name</option>
              <option value="difficulty">Difficulty</option>
              <option value="rating">Rating</option>
            </motion.select>
            <motion.button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className={`p-2 rounded-md ${theme === 'light' ? 'bg-white hover:bg-gray-100' : 'bg-gray-800 hover:bg-gray-700'} transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpDown size={24} className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'} />
            </motion.button>
            <motion.button
              onClick={shufflePlants}
              className={`p-2 rounded-md ${theme === 'light' ? 'bg-white hover:bg-gray-100' : 'bg-gray-800 hover:bg-gray-700'} transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shuffle size={24} className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'} />
            </motion.button>
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-md ${theme === 'light' ? 'bg-white hover:bg-gray-100' : 'bg-gray-800 hover:bg-gray-700'} transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? <Moon size={24} className="text-gray-600" /> : <Sun size={24} className="text-gray-300" />}
            </motion.button>
          </div>
        </motion.div>
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {sortedAndFilteredPlants.map((plant, index) => (
              <motion.div 
                key={plant.id} 
                ref={(el) => (plantRefs.current[index] = el)} 
                data-plant-id={plant.id}
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PlantCard
                  plant={plant}
                  onClick={setSelectedPlant}
                  isVisible={visiblePlants.includes(plant.id.toString())}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
          {selectedPlant && (
            <PlantModal 
              plant={selectedPlant} 
              onClose={() => setSelectedPlant(null)}
              onPrevious={handlePreviousPlant}
              onNext={handleNextPlant}
            />
          )}
        </AnimatePresence>
        {sortedAndFilteredPlants.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mt-8 text-lg`}
          >
            No plants found. Try adjusting your search or filters.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default App;
