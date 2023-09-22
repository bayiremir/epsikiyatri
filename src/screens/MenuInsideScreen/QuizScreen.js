import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {settings} from '../../utils/settings';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon as ArrowLeftIconOutline} from 'react-native-heroicons/outline';
import {
  NavigationHelpersContext,
  useNavigation,
} from '@react-navigation/native';

const QuizScreen = () => {
  const [email, setEmail] = useState('');
  const [questions, setQuestions] = useState([]);
  const [testId, setTestId] = useState(null);
  const [testData, setTestData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [lastPoints, setLastPoints] = useState(0);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const [code, setCode] = useState(null);
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [selectedTestSlug, setSelectedTestSlug] = useState(null);
  const navigation = useNavigation();

  const sendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://npistanbul.com/api/tr/mobile-test-create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            referer: 'mobileApp',
            form_page_url: 'mobileApp',
            test_id: 29, // Seçilen testin id'si
          }),
        },
      );
      const data = await response.json();
      if (data && data.code) {
        setCode(data.code);
      } else {
        console.error('Unexpected format:', data);
        // Beklenmeyen bir format varsa kod burada duracak.
      }
      setTestId(data.testId || 'yourTestId');
      fetchTests();
      setIsEmailSent(true);
    } catch (error) {
      console.error('sendEmail Error:', error);
      setError('Email could not be sent. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTests = () => {
    fetch('https://npistanbul.com/api/tr/tests?token=1')
      .then(res => res.json())
      .then(data => {
        if (data.status && Array.isArray(data.tests)) {
          setTests(data.tests);
        }
      })
      .catch(error => {
        console.error('fetchTests Error:', error);
      });
  };

  useEffect(() => {
    if (isEmailSent) {
      fetchTests();
    }
  }, [isEmailSent]);

  const fetchQuestions = slug => {
    fetch(`https://npistanbul.com/api/tr/test_data/${slug}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setIsLoading(false);
        setCurrentIndex(0); // Sorular yüklendikten sonra indeksi sıfırla
      })
      .catch(error => {
        console.error(`fetchQuestions Error for ${slug}:`, error);
        setIsLoading(false);
      });
  };

  let formattedTestData = [];

  testData.forEach(item => {
    formattedTestData.push({
      id: item.id.toString(),
      answer: item.answer.toString(),
    });
  });

  const recordAnswer = (question_id, answer_id) => {
    if (!question_id || !answer_id) return;

    let updatedTestData = [...testData];

    const index = updatedTestData.findIndex(item => item?.id === question_id);

    if (index !== -1) {
      updatedTestData[index].answer = answer_id;
      updatedTestData[index].selectedAnswerId = answer_id;
    } else {
      updatedTestData.push({
        id: question_id,
        answer: answer_id,
        selectedAnswerId: answer_id,
      });
    }

    setTestData(updatedTestData);
  };

  const selectAnswer = (answer_id, answer, points, question_id) => {
    const newPoints = parseInt(points);
    const updatedScore = prevScore => prevScore - lastPoints + newPoints;

    setSelectedAnswer(answer);
    recordAnswer(question_id, answer_id, newPoints);

    setScore(updatedScore);

    setLastPoints(newPoints);

    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentIndex]: {answer, points: newPoints},
    }));
  };

  const nextQuestion = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const prevQuestion = () => {
    setCurrentIndex(prevIndex => prevIndex - 1);
  };

  useEffect(() => {
    const currentAnswer = answers[currentIndex];
    const newLastPoints = currentAnswer ? parseInt(currentAnswer.points) : 0;

    setSelectedAnswer(currentAnswer ? currentAnswer.answer : null);
    setLastPoints(newLastPoints);
  }, [currentIndex, answers]);

  const submitTest = async (code, answers) => {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('test_name', selectedTestSlug);

    answers.forEach((answer, index) => {
      params.append(`test_data[${index}][id]`, answer.question_id);
      params.append(`test_data[${index}][answer]`, answer.answer_id);
      
    });

    try {
      const response = await fetch(
        'https://npistanbul.com/api/tr/test-create',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: params.toString(),
        },
      );

      const data = await response.json();

      if (data.status === 'true') {
        console.log('Test successfully submitted:', data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  const handleCompleteTest = async () => {
    setIsLoading(true); // Turn on the loading state

    const formattedAnswers = testData.map(item => ({
      question_id: item.id,
      answer_id: item.selectedAnswerId,
    }));

    try {
      await submitTest(code, formattedAnswers);
      setIsLoading(false); // Turn off the loading state

      Alert.alert(
        'Test Tamamlandı',
        'Sonuçlarınız Mailinize iletilecektir',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('HomeScreen'),
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      setIsLoading(false); // Turn off the loading state in case of error
      console.error('An error occurred:', error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.centeredContainer}>
        {!isEmailSent ? (
          <>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/photo/logo.png')}
                style={styles.logo}
              />
              <TouchableOpacity
                style={styles.menuIcon}
                onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={32} color="black" />
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 25,
                  color: 'pink',
                }}>
                Psikolojik Testler
              </Text>
            </View>
            <View>
              <Text style={{paddingTop: 10, margin: 10, lineHeight: 18}}>
                Depresyon; ciddi, psikolojik, fizyolojik sonuçlara yer açan
                psikiyatrik bir hastalıktır. Depresyon belirtileri; iştahsızlık,
                uyku bozulması, günlük aktiviteleri yapamaması, sürekli yorgun
                ve halsiz hissetme sayılabilir. Depresyonun nedenleri arasında;
                biyolojik, sosyolojik ve psikolojik durumlar sayılır.
                Depresyonun farklı türleri vardır: Majör depresyon, Kronik
                Depresyon, A-tipik Depresyon, Mevsimsel Depresyon’dur. Depresyon
                tedavisinde; kişi, aile ve tedavi yöntemleri bütüncül olarak
                önemlidir. Depresyon tedavisinde psikoterapi hizmeti, ilaç
                tedavisi ve beyin uyarım teknikleri uygulanabilir. Depresyon
                belirtileri konusunda merak ettikleriniz için Beck Depresyon
                Testini öneririz. Beck ve arkadaşları (1961) tarafından
                geliştirilmiş, kişinin depresyon yönünden riskini ve depresif
                belirtilerin şiddetini değerlendiren 21 maddeden oluşan bir
                özbildirim ölçeğidir. Test sonuçları tıbbi anlamda kesin bir
                bilgi vermemektedir. Bu testler kendinizle ilgili
                farkındalığınızı arttırmak içindir, tek başına tanı koydurmaz.
                Test sonucunuzun bir uzman tarafından değerlendirilmeden, size
                mail atılacağını önemle belirtmek isteriz. Sağlıklı günler
                dileriz.
              </Text>
            </View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="E-Mail adresinizi giriniz..."
              style={styles.textInputStyle}
            />
            <Button title="Testlere Göz At" onPress={sendEmail} />
            {error && <Text style={{color: 'red'}}>{error}</Text>}
          </>
        ) : (
          <>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/photo/logo.png')}
                style={styles.logo}
              />
              <TouchableOpacity
                style={styles.menuIcon}
                onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={32} color="black" />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <LottieView
                autoPlay
                style={styles.fullScreenAnimation}
                source={require('../../../assets/photo/loading.json')}
              />
            ) : questions.length === 0 ? (
              <FlatList
                data={tests}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTestId(item.id);
                      setSelectedTestSlug(item.slug);
                      fetchQuestions(item.slug);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 15,
                      }}>
                      <Text>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      backgroundColor: '#C8C8C8',
                    }}
                  />
                )}
              />
            ) : (
              <>
                <View style={styles.questionContainer}>
                  <Text style={styles.questionText}>
                    {`${currentIndex + 1}.${questions[currentIndex].title}`}
                  </Text>
                  {questions[currentIndex].secenekler.map(option => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.option,
                        selectedAnswer === option.title
                          ? styles.selected
                          : null,
                      ]}
                      onPress={() =>
                        selectAnswer(
                          option.id,
                          option.title,
                          option.puan,
                          questions[currentIndex].id,
                        )
                      }>
                      <View style={styles.dotContainer}>
                        {selectedAnswer === option.title ? (
                          <View style={styles.filledDot} />
                        ) : (
                          <View style={styles.emptyDot} />
                        )}
                      </View>
                      <Text>{option.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.buttonContainer}>
                  <View style={styles.prevButtonContainer}>
                    {currentIndex > 0 && (
                      <Button title="Önceki Soru" onPress={prevQuestion} />
                    )}
                  </View>
                  <View style={styles.nextButtonContainer}>
                    {currentIndex < questions.length - 1 && (
                      <Button title="Sonraki Soru" onPress={nextQuestion} />
                    )}
                  </View>
                  {questions.length > 0 &&
                    currentIndex === questions.length - 1 && (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Button
                          title="Test'i Bitir"
                          onPress={handleCompleteTest}
                        />
                      </View>
                    )}
                </View>
                <Modal
                  transparent={true}
                  visible={isLoading}
                  onRequestClose={() => {}} // Required on Android
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ActivityIndicator size="large" color="#00ff00" />
                  </View>
                </Modal>
              </>
            )}
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  centeredContainer: {
    justifyContent: 'flex-start', // bu satırı değiştirdik
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
    alignContent: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    width: 300,
    marginTop: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    width: '100%',
    textAlign: 'left',
    paddingLeft: 10,
    paddingBottom: 30,
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: settings.CARD_WIDTH * 2,
    height: settings.CARD_WIDTH * 2.3,
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  selected: {},
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  prevButtonContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  nextButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  fullScreenContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  fullScreenAnimation: {
    width: settings.CARD_WIDTH,
    height: settings.CARD_WIDTH,
  },
  dotContainer: {
    marginRight: 10,
  },
  emptyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  filledDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    backgroundColor: 'white',
    width: 200,
    height: 100,
  },
  menuIcon: {
    position: 'absolute',
    left: 0,
    top: 30,
    left: 20,
  },
});

export default QuizScreen;
