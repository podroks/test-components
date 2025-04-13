<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import MyButton from './components/MyButton.vue'
import MyDropmenu, {
  type DropmenuClickEvent,
  type DropmenuNestedClickEvent,
} from './components/MyDropmenu.vue'
import MyMultiSelectDropmenuTemplate from './components/dropmenuTemplate/MyMultiSelectDropmenuTemplate.vue'
import MyComplexeDropmenuTemplate from './components/dropmenuTemplate/MyComplexeDropmenuTemplate.vue'

const myDropmenuNestedIsOpen = ref(false)
const myDropmenuSelectIsOpen = ref(false)
const myDropmenuNestedSelectIsOpen = ref(false)
const myDropmenuMultiSelectIsOpen = ref(false)
const myDropmenuComplexeIsOpen = ref(false)

const myButtonNestedRef = useTemplateRef<{ rootRef: HTMLElement | null }>('myButtonNestedRef')
const myButtonSelectRef = useTemplateRef<{ rootRef: HTMLElement | null }>('myButtonSelectRef')
const myButtonNestedSelectRef = useTemplateRef<{ rootRef: HTMLElement | null }>(
  'myButtonNestedSelectRef',
)
const myButtonMultiSelectRef = useTemplateRef<{ rootRef: HTMLElement | null }>(
  'myButtonMultiSelectRef',
)
const myButtonComplexeRef = useTemplateRef<{ rootRef: HTMLElement | null }>('myButtonComplexeRef')

const optionsNested = [
  {
    label: 'Edit ...',
    value: 'edit',
    children: [
      {
        label: 'Option 1 aaaaaa',
        value: 'option1',
        children: [
          { label: 'Option 1 aaaaaa', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ],
      },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  },
  { label: 'Option 2 un peu trop long  un peu trop long', value: 'option2' },
  { label: 'Delete', value: 'delete' },
]

const optionsSelect = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
]

const optionsNestedSelect = [
  {
    label: 'Option 1',
    value: 'option1',
    children: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
]

const optionsMultiSelect = [
  { label: 'Option 1', value: 'option1', is: MyMultiSelectDropmenuTemplate },
  { label: 'Option 2', value: 'option2', is: MyMultiSelectDropmenuTemplate },
  { label: 'Option 3', value: 'option3', is: MyMultiSelectDropmenuTemplate },
]

const optionsComplexe = [
  { title: 'Option 1', value: 'option1', subtitle: 'Subtitle1', is: MyComplexeDropmenuTemplate },
  { title: 'Option 2', value: 'option2', subtitle: 'Subtitle2', is: MyComplexeDropmenuTemplate },
  { title: 'Option 3', value: 'option3', subtitle: 'Subtitle3', is: MyComplexeDropmenuTemplate },
]

function onClick(event: DropmenuClickEvent) {
  console.log('Clicked:', event)
}
function onClickNested(event: DropmenuNestedClickEvent) {
  console.log('Clicked nested:', event)
}
const select = ref(['option1', 'option2'])
function onMultiSelectClick(event: DropmenuClickEvent) {
  if (select.value.includes(event.value)) {
    select.value = select.value.filter((value) => value !== event.value)
  } else {
    select.value.push(event.value)
  }
}
</script>

<template>
  <main class="h-screen flex items-center justify-center bg-neutral-50 gap-4">
    <MyButton
      ref="myButtonNestedRef"
      label="Nested"
      @click="myDropmenuNestedIsOpen = !myDropmenuNestedIsOpen"
    />
    <MyButton
      ref="myButtonSelectRef"
      label="Select"
      @click="myDropmenuSelectIsOpen = !myDropmenuSelectIsOpen"
    />
    <MyButton
      ref="myButtonNestedSelectRef"
      label="Nested select"
      @click="myDropmenuNestedSelectIsOpen = !myDropmenuNestedSelectIsOpen"
    />
    <MyButton
      ref="myButtonMultiSelectRef"
      label="Multi select"
      @click="myDropmenuMultiSelectIsOpen = !myDropmenuMultiSelectIsOpen"
    />
    <MyButton
      ref="myButtonComplexeRef"
      label="Multi select"
      @click="myDropmenuComplexeIsOpen = !myDropmenuComplexeIsOpen"
    />
    <!-- Les dropmenu -->
    <MyDropmenu
      v-model:isOpen="myDropmenuNestedIsOpen"
      :options="optionsNested"
      :trigger-ref="myButtonNestedRef?.rootRef"
      placement="left-top"
      :offset-from-trigger="8"
      :offset-from-window="16"
      :offset-nested-alignment="16"
      @click="onClick"
      @click:nested="onClickNested"
    />
    <MyDropmenu
      v-model:isOpen="myDropmenuSelectIsOpen"
      :options="optionsSelect"
      select="option2"
      :trigger-ref="myButtonSelectRef?.rootRef"
      placement="top"
      :offset-from-trigger="8"
      :offset-from-window="16"
      @click="onClick"
    />
    <MyDropmenu
      v-model:isOpen="myDropmenuNestedSelectIsOpen"
      :options="optionsNestedSelect"
      select="option1.option2"
      :trigger-ref="myButtonNestedSelectRef?.rootRef"
      placement="bottom"
      :offset-from-trigger="8"
      :offset-from-window="16"
      @click="onClick"
    />
    <MyDropmenu
      v-model:isOpen="myDropmenuMultiSelectIsOpen"
      :options="optionsMultiSelect"
      :select="select"
      :trigger-ref="myButtonMultiSelectRef?.rootRef"
      placement="right"
      :offset-from-trigger="8"
      :offset-from-window="16"
      @click="onMultiSelectClick"
    />
    <MyDropmenu
      v-model:isOpen="myDropmenuComplexeIsOpen"
      :options="optionsComplexe"
      :trigger-ref="myButtonComplexeRef?.rootRef"
      placement="bottom-right"
      :offset-from-trigger="8"
      :offset-from-window="16"
      @click="onClick"
    />
  </main>
  <div class="h-[200vh] bg-amber-600">coucou</div>
</template>

<style scoped></style>
