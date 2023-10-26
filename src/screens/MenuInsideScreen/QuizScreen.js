import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import {settings} from '../../utils/settings';
import {ArrowLeftIcon as ArrowLeftIconOutline} from 'react-native-heroicons/outline';
import {
  NavigationHelpersContext,
  useNavigation,
} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import InputText from 'react-native-input-validator';
import analytics from '@react-native-firebase/analytics';

const QuizScreen = () => {
  const [email, setEmail] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
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
  const [isChecked, setIsChecked] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [warning, setWarning] = useState('');
  const inputRef = useRef(null);

  const sendEmail = async () => {
    let errorObj = {};

    if (!email || !email.includes('@')) {
      errorObj.email = true;
    }

    if (!isChecked) {
      errorObj.checkbox = true;
    }

    if (Object.keys(errorObj).length > 0) {
      setError(errorObj);
      return;
    }

    if (inputRef.current && inputRef.current.isValidated()) {
      // Your email sending logic here
    } else {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi giriniz.');
    }

    setIsLoading(true);
    try {
      // Send a POST request to the API
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
            test_id: 29,
          }),
        },
      );

      const data = await response.json();

      if (data && data.code) {
        setCode(data.code);
      } else {
        console.error('Unexpected format:', data);
      }

      setTestId(data.testId || 'yourTestId');

      fetchTests();

      setIsEmailSent(true);
      await analytics().logEvent('email_sent');
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

  const fetchQuestions = slug => {
    fetch(`https://npistanbul.com/api/tr/test_data/${slug}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setIsLoading(false);
        setCurrentIndex(0);
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
    if (answers[currentIndex]) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setWarning(''); // Eğer cevap verilmişse, uyarıyı kaldır.
    } else {
      setWarning('Önce cevap vermelisiniz'); // Cevap verilmemişse, uyarıyı göster.
    }
  };
  const prevQuestion = () => {
    setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
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
        return response; // Burada response nesnesini döndürüyoruz
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      throw error; // Bu hatayı yukarıya taşıyoruz
    }
  };

  const handleCompleteTest = async () => {
    // Tüm sorulara cevap verilip verilmediğini kontrol ediyoruz.
    const isAllQuestionsAnswered = testData.every(
      item => item.selectedAnswerId !== null,
    );

    if (!isAllQuestionsAnswered) {
      Alert.alert('Hata', 'Lütfen tüm sorulara cevap verin.');
      return;
    }

    setIsLoading(true);

    const formattedAnswers = testData.map(item => ({
      question_id: item.id,
      answer_id: item.selectedAnswerId,
    }));

    try {
      const response = await submitTest(code, formattedAnswers);
      setIsLoading(false);

      if (response.status === 200) {
        await analytics().logEvent('test_completed');
        setModalContent({
          title: '🎉 Test Tamamlandı',
          message: 'Sonuçlarınız Mailinize iletilecektir.',
          success: true,
        });
      } else {
        setModalContent({
          title: '❌ Hata',
          message: 'Test gönderilirken bir hata oluştu.',
          success: false,
        });
      }
      setModalVisible(true);
    } catch (error) {
      setIsLoading(false);
      setModalContent({
        title: '❌ Hata',
        message: `Test gönderilirken bir hata oluştu. Lütfen cevapları gözden geçirin.`,
        success: false,
      });
      setModalVisible(true);
    }
  };
  useEffect(() => {
    const trackTestEntry = async () => {
      await analytics().logEvent('test_entered');
    };

    trackTestEntry();
  }, []);

  return (
    <View style={styles.container}>
      {!isEmailSent ? (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.centeredContainer}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../../assets/photo/logo.png')}
                  style={styles.logo}
                />
                <TouchableOpacity
                  style={styles.menuIcon}
                  onPress={() => navigation.goBack()}>
                  <ArrowLeftIconOutline
                    name="arrowleft"
                    size={32}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 25,
                    color: 'rgba(64,183,176,1)',
                  }}>
                  Psikolojik Testler
                </Text>
              </View>
              <View>
                <Text style={{paddingTop: 10, margin: 22, lineHeight: 22}}>
                  Depresyon; ciddi, psikolojik, fizyolojik sonuçlara yer açan
                  psikiyatrik bir hastalıktır. Depresyon belirtileri;
                  iştahsızlık, uyku bozulması, günlük aktiviteleri yapamaması,
                  sürekli yorgun ve halsiz hissetme sayılabilir. Depresyonun
                  nedenleri arasında; biyolojik, sosyolojik ve psikolojik
                  durumlar sayılır. Depresyonun farklı türleri vardır: Majör
                  depresyon, Kronik Depresyon, A-tipik Depresyon, Mevsimsel
                  Depresyon’dur. Depresyon tedavisinde; kişi, aile ve tedavi
                  yöntemleri bütüncül olarak önemlidir. Depresyon tedavisinde
                  psikoterapi hizmeti, ilaç tedavisi ve beyin uyarım teknikleri
                  uygulanabilir. Depresyon belirtileri konusunda merak
                  ettikleriniz için Beck Depresyon Testini öneririz. Beck ve
                  arkadaşları (1961) tarafından geliştirilmiş, kişinin depresyon
                  yönünden riskini ve depresif belirtilerin şiddetini
                  değerlendiren 21 maddeden oluşan bir özbildirim ölçeğidir.
                  Test sonuçları tıbbi anlamda kesin bir bilgi vermemektedir. Bu
                  testler kendinizle ilgili farkındalığınızı arttırmak içindir,
                  tek başına tanı koydurmaz. Test sonucunuzun bir uzman
                  tarafından değerlendirilmeden, size mail atılacağını önemle
                  belirtmek isteriz. Sağlıklı günler dileriz.
                </Text>
                <Text style={{margin: 22, lineHeight: 18}}>
                  Teste başlamadan önce, test sonuçlarınızın gönderileceği
                  e-posta adresini giriniz.
                </Text>
              </View>
              <InputText
                onRef={r => {
                  inputRef.current = r;
                }}
                type="email"
                value={email}
                style={styles.textInputStyle}
                onChangeText={text => {
                  setEmail(text);
                }}
                placeholder="E-Mail adresinizi giriniz..."
              />
              <View>
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={sendEmail}>
                  <Text style={styles.buttonText}>Testlere Göz At</Text>
                </TouchableOpacity>
                {error === 'email' && (
                  <Text
                    style={{color: 'red', textAlign: 'center', marginTop: 10}}>
                    Lütfen geçerli bir mail adresi giriniz.
                  </Text>
                )}
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={[styles.checkbox, isChecked && styles.checked]}
                    onPress={() => setIsChecked(!isChecked)}>
                    {isChecked && (
                      <Image
                        source={require('../../../assets/check_icon.png')}
                        style={styles.checkIcon}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => {
                        Linking.openURL('https://npistanbul.com/kisisel-verilerin-islenmesi-hakkinda-bilgilendirme-formu/');
                      }}>
                    <Text style={styles.checkboxLabel}>
                      Kişisel Verilerin Korunması Kanunu kapsamında
                      Bilgilendirme ve Aydınlatma Metnini okudum, onayladım. (*)
                    </Text>
                  </TouchableOpacity>
                </View>
                {error === 'checkbox' && (
                  <Text style={{color: 'red', marginTop: 20}}>
                    Lütfen Kişisel Verilerin Korunması Kanunu'nu onaylayın.
                  </Text>
                )}
              </View>
              {error?.email && (
                <Text
                  style={{color: 'red', textAlign: 'center', marginTop: 10}}>
                  Lütfen geçerli bir mail adresi giriniz.
                </Text>
              )}
              {error?.checkbox && (
                <Text style={{color: 'red', marginTop: 20}}>
                  Lütfen Kişisel Verilerin Korunması Kanunu'nu onaylayın.
                </Text>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
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
              onPress={() => navigation.goBack()}></TouchableOpacity>
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
                    <Image
                      source={require('../../../assets/ideas.png')} //
                      style={{
                        width: 28,
                        height: 28,
                        marginRight: 10,
                        resizeMode: 'contain',
                      }}
                    />
                    <Text style={{color: 'black'}}>{item.name}</Text>
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
                      selectedAnswer === option.title ? styles.selected : null,
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
                    <Text
                      style={{
                        fontSize: 20,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      {option.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {warning !== '' && <Text style={{color: 'red'}}>{warning}</Text>}

              <View style={styles.buttonContainer}>
                <View style={styles.prevButtonContainer}>
                  {currentIndex > 0 && (
                    <TouchableOpacity
                      style={styles.customButton}
                      onPress={prevQuestion}>
                      <Text style={styles.buttonText}>Önceki Soru</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.nextButtonContainer}>
                  {currentIndex < questions.length - 1 && (
                    <TouchableOpacity
                      style={styles.customButton}
                      onPress={nextQuestion}>
                      <Text style={styles.buttonText}>Sonraki Soru</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {questions.length > 0 &&
                  currentIndex === questions.length - 1 && (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity
                        style={styles.customButton}
                        onPress={handleCompleteTest}>
                        <Text style={styles.buttonText}>Test'i Bitir</Text>
                      </TouchableOpacity>
                    </View>
                  )}
              </View>

              <Modal
                transparent={true}
                visible={isLoading}
                onRequestClose={() => {}}>
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

              <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {}}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 20,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 50, marginBottom: 20}}>
                      {modalContent?.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        marginBottom: 20,
                      }}>
                      {modalContent?.message}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: modalContent?.success
                          ? 'rgba(64,183,176,1)'
                          : 'red',
                        padding: 10,
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        setModalVisible(false);
                        if (modalContent?.success) {
                          navigation.navigate('HomeScreen');
                        }
                      }}>
                      <Text style={{color: 'white'}}>Tamam</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  logoContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
    alignContent: 'center',
    justifyContent: 'center',
    paddingTop: 50,
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
    fontSize: 24,
    fontWeight: '500',
    width: '100%',
    height: settings.CARD_WIDTH * 0.7,
    textAlign: 'left',
    paddingLeft: 10,
  },
  questionContainer: {
    backgroundColor: '#fff',
    width: settings.CARD_WIDTH * 2,
    height: settings.CARD_WIDTH * 3.2,
    padding: 20,
  },
  option: {
    borderWidth: 1,
    borderColor: 'rgba(63, 100, 71, 0.8)',
    width: settings.CARD_WIDTH * 1.7,
    height: settings.CARD_WIDTH * 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginTop: 20,
  },
  selected: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'rgba(63, 249, 71, 0.5)',
  },
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
  customButton: {
    backgroundColor: 'rgba(64,183,176,1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  fullScreenContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  fullScreenAnimation: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
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
    top: 80,
    left: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 3,
    marginRight: 10,
    marginLeft: 300,
  },
  checkIcon: {
    width: 18, // İkonun genişliği
    height: 20, // İkonun yüksekliği
  },
  checkboxLabel: {
    fontSize: 12,
    color: 'blue',
    width: '50%',
  },
});

export default QuizScreen;
