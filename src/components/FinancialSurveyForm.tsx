import React, { useState } from 'react';
import './FinancialSurveyForm.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, Award, Users, Rocket, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  email: string;
  age: string;
  gender: string;
  location: string;
  interests: string[];
  hasUsedApps: string;
  platformsUsed: string;
  platformFeatures: string[];
  experienceRating: string;
  platformFeedback: string;
  genderOther: string;
  interestsOther: string;
  platformFeaturesOther: string;
  monthlyInvestmentOther: string;
  monthlyInvestment: string;
  interestLevel: string;
  usageFrequency: string;
  usefulness: string;
  wouldRecommend: string;
}

const FinancialSurveyForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: '',
    gender: '',
    location: '',
    interests: [],
    hasUsedApps: '',
    platformsUsed: '',
    platformFeatures: [],
    experienceRating: '',
    platformFeedback: '',
    genderOther: '',
    interestsOther: '',
    platformFeaturesOther: '',
    monthlyInvestmentOther: '',
    monthlyInvestment: '',
    interestLevel: '',
    usageFrequency: '',
    usefulness: '',
    wouldRecommend: ''
  });
  const [stepAnimationKey, setStepAnimationKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const totalSteps = 8;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Opções traduzidas
  const ageOptions = [
    'Menos de 18 anos',
    '18 a 24 anos',
    '25 a 34 anos',
    '35 a 44 anos',
    '45 a 54 anos',
    '55 anos ou mais'
  ];

  const genderOptions = [
    'Masculino',
    'Feminino',
    'Prefiro não dizer',
    'Outro'
  ];

  const interestOptions = [
    'Ações (bolsa de valores)',
    'Fundos de investimento (multimercado, ações, crédito privado etc.)',
    'Renda fixa (Tesouro Direto, CDB, LCI/LCA)',
    'Planejamento financeiro e orçamento pessoal',
    'Previdência privada',
    'Criptomoedas e outros ativos digitais',
    'Investimento internacional',
    'Outro'
  ];

  const platformFeatureOptions = [
    'Aulas práticas',
    'Vídeos curtos',
    'Dicas rápidas',
    'Linguagem fácil',
    'Simulações',
    'Interação com professor',
    'Atualizações rápidas de mercado',
    'Ferramentas de educação e investimentos',
    'Outro'
  ];

  const monthlyInvestmentOptions = [
    'Nada, só usaria se fosse gratuito',
    'Até R$ 9,90 por mês',
    'Entre R$ 10 e R$ 19,90 por mês',
    'Entre R$ 20 e R$ 29,90 por mês',
    'R$ 30 ou mais',
    'Outro'
  ];

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return true; // Welcome page, no validation needed
      case 1:
        return formData.name.trim() !== '' && formData.email.trim() !== '' && isValidEmail(formData.email);
      case 2:
        return formData.age !== '';
      case 3:
        return formData.gender !== '' && formData.location.trim() !== '';
      case 4:
        return formData.interests.length > 0;
      case 5:
        return formData.hasUsedApps !== '' && (formData.hasUsedApps === 'Não' || formData.platformsUsed.trim() !== '');
      case 6:
        if (formData.hasUsedApps === 'Sim') {
          return formData.platformFeatures.length > 0 && formData.experienceRating !== '' && formData.monthlyInvestment !== '';
        }
        return formData.monthlyInvestment !== '';
      case 7:
        return formData.interestLevel !== '' && formData.usageFrequency !== '' && formData.usefulness !== '' && formData.wouldRecommend !== '';
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps - 1) {
      setStepAnimationKey(prev => prev + 1); // force remount for animation
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else if (!validateCurrentStep()) {
      let errorMessage = "Preencha todas as informações obrigatórias antes de prosseguir.";
      if (currentStep === 1 && formData.email.trim() !== '' && !isValidEmail(formData.email)) {
        errorMessage = "Por favor, insira um endereço de e-mail válido.";
      }
      toast({
        title: "Por favor, complete todos os campos obrigatórios",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setStepAnimationKey(prev => prev + 1); // force remount for animation
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (validateCurrentStep()) {
      setLoading(true);
      try {
        await fetch('http://localhost:3001/api/survey', { // Altere aqui para o seu servidor local
          method: 'POST',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
        });
        sessionStorage.setItem('surveySubmitted', 'true');
        toast({
          title: "Pesquisa Enviada! 🎉",
          description: "Obrigado por nos ajudar a melhorar a educação financeira!",
        });
        setTimeout(() => {
          navigate('/thankyou', { replace: true });
        }, 500);
      } catch (error) {
        toast({
          title: "Falha na submissão",
          description: "Ocorreu um erro ao enviar sua pesquisa. Por favor, tente novamente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    // Prevent access if already submitted
    if (sessionStorage.getItem('surveySubmitted') === 'true') {
      // If coming from ThankYou page and wants to see intro, show intro (step 0)
      if (window.history.state && window.history.state.usr && window.history.state.usr.goToIntro) {
        setCurrentStep(0);
      } else {
        navigate('/thankyou', { replace: true });
      }
    }
    // eslint-disable-next-line
  }, []);

  // Bubble configs for static, always-visible bubbles
  const bubbleConfigs = React.useMemo(() =>
    Array.from({ length: 14 }).map((_, i) => {
      const size = 30 + Math.random() * 90;
      const left = Math.random() * 100;
      const color = [
        'bubble-yellow',
        'bubble-lightyellow',
        'bubble-verylightyellow',
        'bubble-white'
      ][i % 4];
      const opacity = 0.3 + Math.random() * 0.5;
      const duration = 8 + Math.random() * 6; // 8-14s
      const delay = -(Math.random() * duration);
      return { left, size, color, opacity, duration, delay, i };
    }),
  []);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8 animate-fadein-smooth text-center">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <TrendingUp className="h-10 w-10 text-fine-green-500" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-fine-green-500 to-fine-yellow-500 bg-clip-text text-transparent">
                  Pesquisa de Mercado — FinE
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Olá! Somos a <span className="font-semibold text-fine-green-400">FinE</span>, uma startup dedicada a transformar a forma como as pessoas aprendem sobre finanças pessoais.
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Estamos desenvolvendo uma solução digital inovadora para tornar o aprendizado financeiro mais acessível, prático e interessante. Por isso, precisamos da sua ajuda para entender melhor os hábitos, necessidades e preferências das pessoas quando o assunto é educação financeira.
              </p>
              <div className="bg-fine-green-900/20 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-white font-medium text-lg flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Leva menos de 2 minutos para responder</span>
                </p>
              </div>
            </div>
            <div className="pt-8">
              <Button
                onClick={nextStep}
                className="group relative overflow-hidden bg-gradient-to-r from-fine-green-500 to-fine-green-600 hover:from-fine-green-600 hover:to-fine-green-700 text-white font-semibold text-base sm:text-lg px-6 py-3 sm:px-12 sm:py-6 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-fine-green-500/25"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <Rocket className="h-6 w-6 transition-transform group-hover:rotate-12" />
                  <span>Começar</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-fine-yellow-400 to-fine-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 bg-transparent animate-fadein-smooth">
            <div className="space-y-4">
              <Label htmlFor="email" className="text-lg font-medium text-gray-200">
                E-mail <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={`h-12 text-lg border-2 bg-transparent text-white focus:border-gray-600 focus:ring-0 focus:outline-none focus-visible:border-gray-600 focus-visible:ring-0 focus-visible:outline-none transition-none ${
                  formData.email && !isValidEmail(formData.email) ? 'border-red-500' : 'border-gray-600'
                }`}
                style={{ boxShadow: 'none', borderColor: formData.email && !isValidEmail(formData.email) ? '#ef4444' : '#475569', outline: 'none' }}
                placeholder="Digite seu e-mail"
              />
              {formData.email && !isValidEmail(formData.email) && (
                <p className="text-red-400 text-sm">Digite um e-mail válido</p>
              )}
            </div>
            <div className="space-y-4">
              <Label htmlFor="name" className="text-lg font-medium text-gray-200">
                Qual seu nome? <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="h-12 text-lg border-2 border-gray-600 bg-transparent text-white focus:border-gray-600 focus:ring-0 focus:outline-none focus-visible:border-gray-600 focus-visible:ring-0 focus-visible:outline-none transition-none"
                style={{ boxShadow: 'none', borderColor: '#475569', outline: 'none' }}
                placeholder="Digite seu nome completo"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fadein-smooth">
            <Label className="text-lg font-medium text-gray-200">Qual a sua faixa etária? <span className="text-red-400">*</span></Label>
            <RadioGroup
              value={formData.age}
              onValueChange={(value) => updateFormData('age', value)}
              className="space-y-3"
            >
              {ageOptions.map((option) => (
                <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  <RadioGroupItem value={option} id={option} className="border-2 border-fine-green-500 text-fine-green-500" />
                  <Label htmlFor={option} className="text-base cursor-pointer text-gray-300">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fadein-smooth">
            <div className="space-y-4">
              <Label className="text-lg font-medium text-gray-200">Qual é o seu gênero? <span className="text-red-400">*</span></Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => updateFormData('gender', value)}
                className="space-y-3"
              >
                {genderOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <RadioGroupItem value={option} id={option} className="border-2 border-fine-green-500 text-fine-green-500" />
                    <Label htmlFor={option} className="text-base cursor-pointer text-gray-300">{option}</Label>
                    {option === 'Outro' && formData.gender === 'Outro' && (
                      <Input
                        className="ml-2 h-10 text-base border-gray-600 bg-gray-800 text-white"
                        placeholder="Descreva"
                        value={formData.genderOther || ''}
                        onChange={e => updateFormData('genderOther', e.target.value)}
                        style={{ width: 180 }}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Label htmlFor="location" className="text-lg font-medium text-gray-200">
                Onde você mora? <span className="text-red-400">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                className="h-12 text-lg border-2 border-gray-600 bg-gray-800 text-white focus:border-gray-600 focus:ring-0 focus:outline-none focus-visible:border-gray-600 focus-visible:ring-0 focus-visible:outline-none transition-none"
                style={{ boxShadow: 'none', borderColor: '#475569', outline: 'none' }}
                placeholder="Ex: Belo Horizonte - MG"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fadein-smooth">
            <Label className="text-lg font-medium text-gray-200">
              Quais temas de educação financeira mais despertam seu interesse atualmente? <span className="text-red-400">*</span>
              <br />
              <span className="text-sm text-gray-400 font-normal">Selecione quantos quiser.</span>
            </Label>
            <div className="space-y-3">
              {interestOptions.map((option) => (
                <div key={option} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  <Checkbox
                    id={option}
                    checked={formData.interests.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData('interests', [...formData.interests, option]);
                      } else {
                        updateFormData('interests', formData.interests.filter(i => i !== option));
                      }
                    }}
                    className="border-2 border-fine-green-500 data-[state=checked]:bg-fine-green-500"
                  />
                  <Label htmlFor={option} className="text-base cursor-pointer leading-relaxed text-gray-300">{option}</Label>
                  {option === 'Outro' && formData.interests.includes('Outro') && (
                    <Input
                      className="ml-2 h-10 text-base border-gray-600 bg-gray-800 text-white"
                      placeholder="Descreva"
                      value={formData.interestsOther || ''}
                      onChange={e => updateFormData('interestsOther', e.target.value)}
                      style={{ width: 180 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-fadein-smooth">
            <Label className="text-lg font-medium text-gray-200">
              Você já utilizou ou utiliza algum aplicativo ou plataforma para aprender sobre finanças pessoais? <span className="text-red-400">*</span>
            </Label>
            <RadioGroup
              value={formData.hasUsedApps}
              onValueChange={(value) => updateFormData('hasUsedApps', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                <RadioGroupItem value="Sim" id="hasUsedApps-yes" className="border-2 border-fine-green-500 text-fine-green-500" />
                <Label htmlFor="hasUsedApps-yes" className="text-base cursor-pointer text-gray-300">Sim</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                <RadioGroupItem value="Não" id="hasUsedApps-no" className="border-2 border-fine-green-500 text-fine-green-500" />
                <Label htmlFor="hasUsedApps-no" className="text-base cursor-pointer text-gray-300">Não</Label>
              </div>
            </RadioGroup>
            {formData.hasUsedApps === 'Sim' && (
              <div className="space-y-4 animate-fade-in-up">
                <Label htmlFor="platforms" className="text-lg font-medium text-gray-200">
                  Se sim, qual(is)?
                </Label>
                <Input
                  id="platforms"
                  value={formData.platformsUsed}
                  onChange={(e) => updateFormData('platformsUsed', e.target.value)}
                  className="h-12 text-lg border-2 border-gray-600 bg-gray-800 text-white focus:border-gray-600 focus:ring-0 focus:outline-none focus-visible:border-gray-600 focus-visible:ring-0 focus-visible:outline-none transition-none"
                  style={{ boxShadow: 'none', borderColor: '#475569', outline: 'none' }}
                  placeholder="Ex: Mobills, Organizze, Warren, etc."
                />
              </div>
            )}
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-fadein-smooth">
            {formData.hasUsedApps === 'Sim' && (
              <>
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-gray-200">
                    O que você mais gosta nessas plataformas?
                    <br />
                    <span className="text-sm text-gray-400 font-normal">Selecione quantos quiser.</span>
                  </Label>
                  <div className="space-y-3">
                    {platformFeatureOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                        <Checkbox
                          id={option}
                          checked={formData.platformFeatures.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData('platformFeatures', [...formData.platformFeatures, option]);
                            } else {
                              updateFormData('platformFeatures', formData.platformFeatures.filter(f => f !== option));
                            }
                          }}
                          className="border-2 border-fine-green-500 data-[state=checked]:bg-fine-green-500"
                        />
                        <Label htmlFor={option} className="text-base cursor-pointer text-gray-300">{option}</Label>
                        {option === 'Outro' && formData.platformFeatures.includes('Outro') && (
                          <Input
                            className="ml-2 h-10 text-base border-gray-600 bg-gray-800 text-white"
                            placeholder="Descreva"
                            value={formData.platformFeaturesOther || ''}
                            onChange={e => updateFormData('platformFeaturesOther', e.target.value)}
                            style={{ width: 180 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-gray-200">
                    Se você já utilizou alguma plataforma ou aplicativo para aprender sobre finanças, como você avaliaria sua experiência? <span className="text-red-400">*</span>
                    <br />
                    <span className="text-sm text-gray-400 font-normal">De 1 a 5, onde 1 = Muito insatisfeito e 5 = Muito satisfeito</span>
                  </Label>
                  <RadioGroup
                    value={formData.experienceRating}
                    onValueChange={(value) => updateFormData('experienceRating', value)}
                    className="space-y-3"
                  >
                    {[
                      '1 – Muito insatisfeito',
                      '2 – Insatisfeito',
                      '3 – Neutro',
                      '4 – Satisfeito',
                      '5 – Muito satisfeito'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                        <RadioGroupItem value={option} id={option} className="border-2 border-fine-green-500 text-fine-green-500" />
                        <Label htmlFor={option} className="text-base cursor-pointer text-gray-300">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-gray-200">
                    Se quiser, conte o que mais te agradou ou te incomodou nessas plataformas:
                  </Label>
                  <Input
                    as="textarea"
                    rows={3}
                    value={formData.platformFeedback}
                    onChange={e => updateFormData('platformFeedback', e.target.value)}
                    className="w-full border-2 border-gray-600 bg-gray-800 text-white p-2 rounded-md"
                    placeholder="Escreva livremente..."
                  />
                </div>
              </>
            )}
            <div className="space-y-4">
              <Label className="text-lg font-medium text-gray-200">
                Quanto você estaria disposto(a) a investir mensalmente em uma plataforma completa de educação financeira? <span className="text-red-400">*</span>
              </Label>
              <RadioGroup
                value={formData.monthlyInvestment}
                onValueChange={(value) => updateFormData('monthlyInvestment', value)}
                className="space-y-3"
              >
                {monthlyInvestmentOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <RadioGroupItem value={option} id={option} className="border-2 border-fine-green-500 text-fine-green-500" />
                    <Label htmlFor={option} className="text-base cursor-pointer text-gray-300">{option}</Label>
                    {option === 'Outro' && formData.monthlyInvestment === 'Outro' && (
                      <Input
                        className="ml-2 h-10 text-base border-gray-600 bg-gray-800 text-white"
                        placeholder="Descreva"
                        value={formData.monthlyInvestmentOther || ''}
                        onChange={e => updateFormData('monthlyInvestmentOther', e.target.value)}
                        style={{ width: 180 }}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6 animate-fadein-smooth">
            <div className="space-y-4">
              <Label className="text-lg font-medium text-gray-200">
                Se existisse um aplicativo gratuito que te ensinasse finanças pessoais de forma prática e divertida, com recompensas por evolução (como certificados, benefícios ou prêmios), o quanto isso te interessaria? <span className="text-red-400">*</span>
              </Label>
              <RadioGroup
                value={formData.interestLevel}
                onValueChange={(value) => updateFormData('interestLevel', value)}
                className="space-y-3"
              >
                {[
                  'Nada interessado(a)',
                  'Pouco interessado(a)',
                  'Indiferente',
                  'Interessado(a)',
                  'Muito interessado(a)'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <RadioGroupItem value={option} id={option} className="border-2 border-fine-green-500 text-fine-green-500" />
                    <Label htmlFor={option} className="text-base cursor-pointer text-gray-300">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Label className="text-lg font-medium text-gray-200">
                Com que frequência você acredita que usaria um aplicativo como esse? <span className="text-red-400">*</span>
              </Label>
              <RadioGroup
                value={formData.usageFrequency}
                onValueChange={(value) => updateFormData('usageFrequency', value)}
                className="space-y-3"
              >
                {[
                  'Uma vez por mês ou menos',
                  'Algumas vezes por mês',
                  'Semanalmente',
                  '2 a 3 vezes por semana',
                  'Diariamente'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <RadioGroupItem value={option} id={option} className="border-2 border-fine-green-500 text-fine-green-500" />
                    <Label htmlFor={option} className="text-base cursor-pointer text-gray-300">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Label className="text-lg font-medium text-gray-200">
                Na sua opinião, o quão útil seria um aplicativo gratuito de educação financeira para sua vida hoje? <span className="text-red-400">*</span>
              </Label>
              <RadioGroup
                value={formData.usefulness}
                onValueChange={(value) => updateFormData('usefulness', value)}
                className="space-y-3"
              >
                {[
                  'Nada útil',
                  'Pouco útil',
                  'Razoavelmente útil',
                  'Muito útil',
                  'Essencial'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <RadioGroupItem value={option} id={option} className="border-2 border-fine-green-500 text-fine-green-500" />
                    <Label htmlFor={option} className="text-base cursor-pointer text-gray-300">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Label className="text-lg font-medium text-gray-200">
                Você indicaria esse aplicativo para amigos ou familiares? <span className="text-red-400">*</span>
              </Label>
              <RadioGroup
                value={formData.wouldRecommend}
                onValueChange={(value) => updateFormData('wouldRecommend', value)}
                className="space-y-3"
              >
                {['Sim', 'Não', 'Talvez'].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <RadioGroupItem value={option} id={option} className="border-2 border-fine-green-500 text-fine-green-500" />
                    <Label htmlFor={option} className="text-base cursor-pointer text-gray-300">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Animated bubbles background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {bubbleConfigs.map(bubble => (
          <div
            key={bubble.i}
            className={`bubble absolute rounded-full ${bubble.color}`}
            style={{
              left: `${bubble.left}%`,
              width: bubble.size,
              height: bubble.size,
              opacity: bubble.opacity,
              bottom: 0,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 w-full">
        {/* Render the form content directly, no Card or container */}
        {currentStep > 0 && (
          <div className="pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4 gap-2 sm:gap-0">
            </div>
            <Progress 
              value={progress} 
              className="h-2 sm:h-3 bg-black rounded-full overflow-hidden shadow-inner border border-gray-700 [&>div]:bg-green-500 [&>div]:transition-all [&>div]:duration-700 [&>div]:ease-in-out"
              style={{ boxShadow: '0 2px 8px 0 rgba(34,197,94,0.15)', border: '1.5px solid #475569' }}
            />
          </div>
        )}
        <div className="px-1 sm:px-8 pb-8">
          <div key={stepAnimationKey} className="min-h-[300px] sm:min-h-[400px]">
            {renderStep()}
          </div>
          {currentStep > 0 && (
            <div className="flex flex-row justify-between mt-8 pt-6 gap-3">
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 border-2 border-gray-600 bg-black text-gray-300 text-base sm:text-lg transition-none hover:bg-black hover:text-gray-300 focus:bg-black focus:text-gray-300 active:bg-black active:text-gray-300 min-w-[110px] sm:min-w-[140px]"
                style={{ pointerEvents: 'auto' }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hover:text-gray-300 focus:text-gray-300 active:text-gray-300">Anterior</span>
              </Button>
              {currentStep === totalSteps - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-5 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-fine-green-500 to-fine-green-600 text-white font-medium text-base sm:text-lg min-w-[110px] sm:min-w-[140px] relative"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="inline-flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span>Enviando...</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4" />
                      <span>Enviar Pesquisa</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-fine-green-500 to-fine-green-600 text-white font-medium text-base sm:text-lg min-w-[110px] sm:min-w-[140px]"
                >
                  <span>Próximo</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 text-center w-full z-20 pointer-events-none">
        <p className="text-sm text-gray-500 pointer-events-auto">
          Feito por <a href="https://pedrodev.website/" target="_blank" rel="noopener noreferrer" className="font-semibold text-fine-green-400 hover:text-fine-green-300 transition-colors">Pedro Developments</a>
        </p>
      </div>
    </div>
  );
};

export default FinancialSurveyForm;
