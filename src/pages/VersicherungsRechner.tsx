
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InsuranceTypeGrid from '@/components/insurance/InsuranceTypeGrid';
import AIExplanation from '@/components/insurance/AIExplanation';
import LoadingSimulation from '@/components/insurance/LoadingSimulation';

const VersicherungsRechner = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSteps, setLoadingSteps] = useState({
    connecting: false,
    analyzing: false,
    preparing: false,
    ready: false
  });

  useEffect(() => {
    const simulateLoading = async () => {
      setLoadingSteps(prev => ({ ...prev, connecting: true }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoadingSteps(prev => ({ ...prev, analyzing: true }));
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoadingSteps(prev => ({ ...prev, preparing: true }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoadingSteps(prev => ({ ...prev, ready: true }));
      setIsLoading(false);
    };

    simulateLoading();
  }, []);

  const insuranceTypes = [
    {
      title: "Betriebshaftpflichtversicherung",
      description: "Schützt Ihr Unternehmen vor Schadenersatzansprüchen Dritter"
    },
    {
      title: "Gebäudeversicherung",
      description: "Absicherung von Geschäftsgebäuden gegen Elementarschäden"
    },
    {
      title: "Krankentaggeldversicherung",
      description: "Lohnfortzahlung bei krankheitsbedingten Ausfällen"
    },
    {
      title: "Unfallversicherung",
      description: "Obligatorische und freiwillige Unfallversicherung für Mitarbeitende"
    },
    {
      title: "Sachversicherung",
      description: "Schutz von Geschäftsinventar und Waren"
    },
    {
      title: "Cyberversicherung",
      description: "Absicherung gegen digitale Risiken und Datenverlust"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-swiss-darkblue mb-4">
            Versicherungs Rechner & KI Beratung
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Optimieren Sie Ihre Versicherungslösungen mit unserem KI-gestützten Prämienrechner
          </p>
        </div>

        <div className="mb-12">
          <AIExplanation />
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-swiss-darkblue mb-6 text-center">
            Prämienrechner
          </h2>
          
          <div className="mb-8">
            <LoadingSimulation loadingSteps={loadingSteps} />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                disabled={isLoading}
                className="w-full bg-swiss-red hover:bg-red-700 text-white"
              >
                Beratung starten
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[85vw] h-[85vh] max-w-none">
              <div className="w-full h-full bg-white p-6 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-swiss-darkblue mb-4">
                  KMU Versicherungsrechner
                </h3>
                <p className="text-center mb-6">
                  Unser KI-gestützter Versicherungsrechner ist derzeit in Wartung.
                  <br />
                  Bitte kontaktieren Sie uns direkt für eine persönliche Beratung.
                </p>
                <Button 
                  className="bg-swiss-red hover:bg-red-700 text-white"
                  onClick={() => window.location.href = '/kontakt'}
                >
                  Kontakt aufnehmen
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-16">
          <InsuranceTypeGrid insuranceTypes={insuranceTypes} />
        </div>
      </div>
    </div>
  );
};

export default VersicherungsRechner;
