<template>
  <h1 class="d-flex align-center mb-4">
    Quiz
<!--    Quiz: {{ quizzTitle }}-->

    <v-spacer />
  </h1>
  <v-spacer />

  <error v-if="quizzStore.error" :text="quizzStore.error" @hide="quizzStore.clearError"></error>

  <v-progress-circular
      v-if="quizzStore.isLoading"
      color="primary"
      indeterminate
      size="50"
      width="5"
      class="ma-5"
  />

  <div v-else-if="quizzStore.quizzes.length === 0">
    No quizzes available
  </div>

  <div class="quiz-container">


    <v-container>

<!--      <v-card>-->
<!--        <v-card-title>-->
<!--              {{ userStore.user }}-->
<!--        </v-card-title>-->
<!--      </v-card>-->

<!--            <v-card>-->
<!--              <v-card-title>-->
<!--                {{ userStore.user.username }}-->
<!--                {{ userStore.user.role }}-->
<!--                {{ theoCourse }}-->
<!--                -->
<!--                {{ userStore.user_id}}-->
<!--              </v-card-title>-->
<!--            </v-card>-->

      <v-row align="center" justify="center">
        <v-col cols="12" sm="10" md="10">

          <v-card :key="currentCard">
            <v-card-text>
              {{ cards[currentCard].text }}
            </v-card-text>
          </v-card>

          <br>

          <v-layout row justify-center class="align-container">
            <v-btn
                color="primary"
                class="mx-2"
                @click="prevCard"
                :disabled="currentCard === 0"
            >
              Previous
            </v-btn>
            <v-btn
                color="primary"
                class="mx-2"
                @click="nextCard"
                :disabled="currentCard === cards.length - 1"
            >
              Next
            </v-btn>
          </v-layout>

            <br>

          <v-progress-linear
              :model-value="progress"
              color="primary"
              height="20"
          ></v-progress-linear>

          <br>

<!--          just one quizz-->
          <v-card v-if="currentQuizIndex < quizzes.length" :key="currentQuizIndex" class="mb-5">
            <v-card-title style="white-space: normal;">
              {{ quizzes[currentQuizIndex].question }}</v-card-title>
            <br>
            <v-card-text>
              <v-btn
                  block
                  v-for="(option, optionIndex) in quizzes[currentQuizIndex].options.split(';')"
                  :key="optionIndex"
                  :color="getOptionColor(currentQuizIndex, optionIndex)"
                  @click="selectOption(currentQuizIndex, optionIndex)"
                  class="my-5"
                  :disabled="answeredQuestions[currentQuizIndex]"
              >
                {{ option }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>




      <v-col>


        <div class="align-container">

          <v-btn
              @click="prevQuiz"
              class="mx-2"
              color="primary"
              padding="10px"
              :disabled="currentQuizIndex === 0"
          >Previous</v-btn>


          <v-btn
              @click="submitAnswers"
              class="mx-2"
              color="primary"
              padding="10px"
              :disabled="AnswersCount !== quizzes.length"
          >Submit</v-btn>


          <v-btn
              @click="nextQuiz"
              class="mx-2"
              color="primary"
              padding="10"
              :disabled="currentQuizIndex === quizzes.length-1"
          >Next</v-btn>


        </div>






      </v-col>
    </v-container>

<!--    currentQuizIndex: {{ currentQuizIndex }}-->


    <div class="text-center">
      <v-row align="center" justify="center">
      <v-col cols="12" sm="3" md="3">

      <v-card>
        Answers: {{ AnswersCount }} / {{ quizzes.length }}  <br>
        Correct Answers: {{ correctAnswersCount }} / {{ quizzes.length }} <br>
        Lesson progress: {{ progress }}% <br>
        Correct: {{ correct }}%
      </v-card>

      </v-col>
      </v-row>


    </div>

  </div>


</template>





<script>
import { mapStores } from "pinia";
import { useLessonStore } from "../stores/LessonStore";
import { useQuizzStore} from "../stores/QuizzStore";
import Error from "../components/Error.vue";
import {useUserStore} from "../stores/UserStore";

export default {
  name: "LessonsDetailView",

  data() {
    return {
      quizzes: [
        {
          "id": 1,
          "lessons_id": 1,
          "question": "What type of manufacturing type best describe 3D printing?",
          "options": "Additive; Magic; Subtractive",
          "correct": 1
        },
        {
          "id": 2,
          "lessons_id": 1,
          "question": "What type of 3D printer does Mendelu use for this course?",
          "options": "FDM; SLS; SLA",
          "correct": 1
        },
        {
          "id": 3,
          "lessons_id": 1,
          "question": "Which of these technologies could be used for making metal parts?",
          "options": "FDM; SLS; SLA",
          "correct": 2
        },
        {
          "id": 4,
          "lessons_id": 1,
          "question": "Which part of light spectrum is used to cure resin?",
          "options": "Visible light; InfraRed; UltraViolet",
          "correct": 3
        }
        //placeholder for not correctly functioning quizzes
      ],
      answeredQuestions: [],
      selectedOptions: [],
      correctAnswersCount: 0,
      AnswersCount: 0,
      currentQuizIndex: 0,
      currentCard: 0,
      cards: [
        { text: "3D Printing refers to an additive manufacturing method, which involves the gradual addition of material layer by layer based on a 3D model until the desired object is created. 3D printing is primarily used in sectors requiring rapid prototyping, art, medicine, and in manufacturing itself. The most commercially used technologies include Fused Deposition Modeling (FDM), Stereolithography (SLA), and Selective Laser Sintering (SLS). Each of these technologies offers a range of advantages, disadvantages, available materials, different price levels compared to others, and thus, none can universally be declared the best." },
        { text: "FDM – The most common 3D printing technology, especially due to its very good accessibility and low costs. It operates on the principle of extruding melted polymer through a nozzle onto the printing bed, where the polymer solidifies. This type of 3D printer is most commonly encountered among hobbyists and in educational institutions. It is particularly suitable for creating prototypes, simple prostheses, and small-batch parts with looser tolerances and lower demands on structural strength and surface finish." },
        { text: "SLA – Uses a UV light source to selectively cure photopolymer resin in a tank layer by layer. Compared to FDM, it generally offers much finer surface finishes and accuracy. Disadvantages include higher resin costs compared to FDM polymers, the need for regular maintenance to prevent resin contamination, sensitivity to UV radiation, and increased caution when handling the resin, as it is often a toxic substance. With these properties, it is suitable for creating precise prototypes, jewelry, and with the use of biocompatible materials, this technology has also found applications in dental medicine." },
        { text: "SLS – A powdered material, which can be plastic, glass, ceramic, nylon, or metal, is joined with surrounding particles by the heat from a laser without melting the entire volume of material. This process, known as sintering or fusing, is also repeated layer by layer. It is suitable for creating very durable, geometrically complex objects without the need for supports and with minimal waste material. Among the major disadvantages are high energy requirements, regular maintenance, and possibly the need to further finish the surface of the produced product. The technology has found applications in the automotive, aerospace, and medical industries." }
      ],
    };
  },

  components: {
    Error,
  },

  created() {
    // this.lessonStore.getQuizzes();
    this.quizzStore.getQuizzes();
    this.quizzStore.getTitle(1);
    // this.lessonStore.getQuizzes1();
  },

  computed: {
    ...mapStores(useQuizzStore, useUserStore),
    progress() {
      return (this.AnswersCount / this.quizzes.length) * 100;
    },
    correct() {
      return (this.correctAnswersCount / this.quizzes.length) * 100;
    },
    // quizzTitle() {
    //   return this.quizzStore.getTitle(1);
    // }  //doenst work properly
  },

  methods: {

    // getID() {
    //   return int(userStore.user.id)  //idk but without it id doesnt work;
    // },

    nextCard() {
      if (this.currentCard < this.cards.length - 1) this.currentCard++;
    },
    prevCard() {
      if (this.currentCard > 0) this.currentCard--;
    },

    nextQuiz() {
      if (this.currentQuizIndex < this.quizzes.length - 1) {
        this.currentQuizIndex++;
      }
    },

    prevQuiz() {
      if (this.currentQuizIndex < this.quizzes.length) {
        this.currentQuizIndex--;
      }
    },
    submitAnswers() {
      const theoCourse = this.userStore.user.theoretical_course;
      const userId = this.userStore.user.id;

      if (theoCourse === 0) {
        this.userStore.addScore(userId, this.correctAnswersCount*10);  //doesnt work without userId
        this.userStore.theoretical(userId)
        this.$router.push("/leaderboard");
      } else {
        this.userStore.addScore(userId, 0);  //doesnt work without userId
        this.userStore.theoretical(userId)
        this.$router.push("/leaderboard");
      }


      // const userId = this.userStore.user.id;
      // this.userStore.addScore(userId, this.correctAnswersCount*10);  //doesnt work without userId
      // this.$router.push("/leaderboard");

    },

    selectOption(quizIndex, optionIndex) {
      if (this.selectedOptions[quizIndex] === optionIndex + 1) {
        return;
      }

      const correctAnswer = this.quizzes[quizIndex].correct;
      this.selectedOptions[quizIndex] = optionIndex + 1;
      if (correctAnswer === optionIndex + 1) {
        this.correctAnswersCount++;
      }
      this.AnswersCount++;
      this.answeredQuestions[quizIndex] = true;
      this.disableOptions(quizIndex);
    },


    getOptionColor(quizIndex, optionIndex) {
      const selected = this.selectedOptions[quizIndex];
      if (selected === undefined) return '';
      return optionIndex + 1 === selected
          ? (optionIndex + 1 === this.quizzes[quizIndex].correct ? 'green' : 'red')
          : '';
    },

    disableOptions(quizIndex) {
      this.quizzes[quizIndex].options.split(';').forEach((_, optionIndex) => {
        const optionButton = document.querySelector(`#option-${quizIndex}-${optionIndex}`);
        if (optionButton) {
          optionButton.disabled = true;
        }
      });
    },

  },
};
</script>


<style scoped>


.align-container {
  display: flex;
  justify-content: center;
  /*padding: 8px;*/
  /*padding-top: 24px;*/
}

</style>
