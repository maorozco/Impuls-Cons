import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder

class BioCyclePredictor:
    def __init__(self):
        self.model = None
        self.encoders = {}
        self.is_trained = False
        self.training_samples = 0
        self.r2_score = 0

    def train(self):
        data = {
            'contaminant': ['PET','PET','PET','PET','PET','PET','PET','PET',
                          'HDPE','HDPE','HDPE','LDPE','LDPE',
                          'PP','PP','PS','PS',
                          'hydrocarbons','hydrocarbons','hydrocarbons','hydrocarbons',
                          'organophosphates','organophosphates','organophosphates',
                          'glyphosate','glyphosate','glyphosate',
                          'azo_dyes','azo_dyes','azo_dyes',
                          'heavy_metals','heavy_metals',
                          'mixed_plastics','mixed_plastics',
                          'organochlorines','organochlorines',
                          'carbamates','carbamates',
                          'phenols','phenols',
                          'diesel','diesel','diesel'],
            'temp_C': [50,72,30,40,50,28,35,22,
                      30,35,28, 30,30,
                      37,28, 28,30,
                      30,35,25,30,
                      30,25,35,
                      35,28,25,
                      37,30,25,
                      25,30,
                      30,28,
                      28,30,
                      30,25,
                      30,28,
                      30,35,25],
            'pH': [8.0,8.0,7.0,7.0,8.0,7.5,7.0,7.0,
                  7.0,7.0,7.5, 7.0,7.0,
                  8.0,7.5, 6.5,7.0,
                  7.0,7.0,7.5,6.5,
                  7.0,6.5,7.5,
                  8.0,7.0,7.0,
                  5.0,6.5,7.0,
                  5.0,5.5,
                  7.0,7.0,
                  7.0,6.5,
                  7.0,7.0,
                  7.0,6.5,
                  7.0,7.0,7.5],
            'mode': ['bioreactor','bioreactor','bioreactor','bioreactor','bioreactor','in_situ','bioreactor','in_situ',
                    'bioreactor','bioreactor','in_situ', 'bioreactor','in_situ',
                    'bioreactor','in_situ', 'bioreactor','bioreactor',
                    'in_situ','in_situ','in_situ','bioreactor',
                    'in_situ','in_situ','bioreactor',
                    'in_situ','in_situ','in_situ',
                    'bioreactor','bioreactor','bioreactor',
                    'bioreactor','bioreactor',
                    'bioreactor','in_situ',
                    'in_situ','in_situ',
                    'in_situ','bioreactor',
                    'bioreactor','bioreactor',
                    'in_situ','in_situ','in_situ'],
            'contamination_pct': [0,0,10,5,0,25,5,40,
                                10,5,20, 10,20,
                                5,20, 5,10,
                                20,15,30,10,
                                15,25,5,
                                10,20,30,
                                5,10,20,
                                10,15,
                                40,50,
                                15,25,
                                10,5,
                                5,15,
                                20,10,30],
            'pretreatment': [1,1,0,1,1,0,1,0,
                           1,1,0, 1,0,
                           1,0, 1,1,
                           0,0,0,1,
                           0,0,1,
                           0,0,0,
                           1,1,0,
                           1,1,
                           1,0,
                           0,0,
                           0,1,
                           1,0,
                           0,0,0],
            'time_weeks': [1,0.5,6,3,1,8,3,12,
                         20,16,20, 16,20,
                         16,16, 12,12,
                         8,6,12,4,
                         2,4,1,
                         2,4,6,
                         0.5,1,2,
                         4,4,
                         12,16,
                         2,4,
                         2,1,
                         2,4,
                         8,6,12],
            'degradation_pct': [95,90,55,80,95,45,85,30,
                              35,40,20, 30,15,
                              25,12, 18,22,
                              66,70,50,80,
                              96,70,98,
                              80,65,50,
                              95,85,70,
                              95,90,
                              45,30,
                              90,75,
                              90,100,
                              95,80,
                              65,75,45]
        }

        df = pd.DataFrame(data)

        for col in ['contaminant', 'mode']:
            self.encoders[col] = LabelEncoder()
            df[col + '_enc'] = self.encoders[col].fit_transform(df[col])

        X = df[['contaminant_enc', 'temp_C', 'pH', 'mode_enc', 'contamination_pct', 'pretreatment', 'time_weeks']]
        y = df['degradation_pct']

        self.model = GradientBoostingRegressor(
            n_estimators=100, max_depth=4, learning_rate=0.1, random_state=42
        )
        self.model.fit(X, y)
        self.training_samples = len(df)
        self.is_trained = True

        from sklearn.model_selection import cross_val_score
        scores = cross_val_score(self.model, X, y, cv=min(5, len(df)//3), scoring='r2')
        self.r2_score = max(0, scores.mean())

        return self

    def _encode(self, col, value):
        try:
            return self.encoders[col].transform([value])[0]
        except (ValueError, KeyError):
            return 0

    def predict(self, contaminant, temp_C, pH, mode, contamination_pct, pretreatment, time_weeks):
        if not self.is_trained:
            self.train()

        X = np.array([[
            self._encode('contaminant', contaminant),
            temp_C, pH,
            self._encode('mode', mode),
            contamination_pct,
            pretreatment,
            time_weeks
        ]])

        pred = self.model.predict(X)[0]
        return max(0, min(100, pred))

    def predict_timeline(self, contaminant, temp_C, pH, mode, contamination_pct, pretreatment, max_weeks=16):
        timeline = [(0, 0.0)]
        for week in [1, 2, 3, 4, 6, 8, 10, 12, 14, 16]:
            if week <= max_weeks:
                pred = self.predict(contaminant, temp_C, pH, mode, contamination_pct, pretreatment, week)
                timeline.append((week, round(pred, 1)))
        return timeline

    def get_info(self):
        return {
            'algorithm': 'Gradient Boosting Regressor',
            'samples': self.training_samples,
            'r2': round(self.r2_score, 2),
            'sources': 'Nature, Science, ACS Catalysis, EST Letters, Springer Biodegradation, ScienceDirect, PMC'
        }

_predictor = None

def get_predictor():
    global _predictor
    if _predictor is None:
        _predictor = BioCyclePredictor()
        _predictor.train()
    return _predictor
