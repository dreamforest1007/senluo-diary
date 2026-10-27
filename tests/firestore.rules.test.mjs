import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

// ALWAYS use a demo- project and the emulator; this test NEVER connects to production.
const env = await initializeTestEnvironment({
  projectId: 'demo-sylva-v2',
  firestore: {
    host: '127.0.0.1',
    port: 8080,
    rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8')
  }
});

function snapshot(overrides = {}) {
  return {
    format: 'sylva-life-snapshot-v1',
    payload: JSON.stringify({ diaries: [], tasks: [{ id: 'testing' }], tx: [] }),
    savedAt: Timestamp.now(),
    clientSavedAt: '2026-10-27T08:00:00.000Z',
    ...overrides
  };
}

const latest = 'users/test-user-a/backups/latest';
const history = `${latest}/versions/history-001`;
const authA = env.authenticatedContext('test-user-a');
const authB = env.authenticatedContext('test-user-b');
const anon = env.unauthenticatedContext();

await env.withSecurityRulesDisabled(async ctx => {
  await setDoc(doc(ctx.firestore(), latest), snapshot());
  await setDoc(doc(ctx.firestore(), history), snapshot());
});

try {
  await test('Unauthenticated clients cannot read latest', async () => {
    await assertFails(getDoc(doc(anon.firestore(), latest)));
  });
  await test('Other users cannot read latest', async () => {
    await assertFails(getDoc(doc(authB.firestore(), latest)));
  });
  await test('Owner can read latest', async () => {
    const result = await assertSucceeds(getDoc(doc(authA.firestore(), latest)));
    assert.ok(result.exists());
  });
  await test('Other users cannot overwrite latest', async () => {
    await assertFails(setDoc(doc(authB.firestore(), latest), snapshot()));
  });
  await test('Owner can overwrite latest with valid data', async () => {
    await assertSucceeds(setDoc(doc(authA.firestore(), latest), snapshot()));
  });
  await test('Owner cannot directly delete latest', async () => {
    await assertFails(deleteDoc(doc(authA.firestore(), latest)));
  });
  await test('Owner cannot write missing required fields', async () => {
    const broken = snapshot();
    delete broken.payload;
    await assertFails(setDoc(doc(authA.firestore(), latest), broken));
  });
  await test('Owner cannot write unknown extra fields', async () => {
    await assertFails(setDoc(doc(authA.firestore(), latest), snapshot({ extra: true })));
  });
  await test('Owner cannot write oversized UTF-8 payloads', async () => {
    await assertFails(setDoc(doc(authA.firestore(), latest), snapshot({ payload: '多'.repeat(200001) })));
  });
  await test('Owner can create new immutable history version', async () => {
    await assertSucceeds(setDoc(doc(authA.firestore(), `${latest}/versions/history-002`), snapshot()));
  });
  await test('Other user cannot create history version', async () => {
    await assertFails(setDoc(doc(authB.firestore(), `${latest}/versions/history-003`), snapshot()));
  });
  await test('Owner can read existing history version', async () => {
    await assertSucceeds(getDoc(doc(authA.firestore(), history)));
  });
  await test('Owner can list history versions', async () => {
    const results = await assertSucceeds(getDocs(collection(authA.firestore(), `${latest}/versions`)));
    assert.ok(results.size >= 2);
  });
  await test('Other user cannot read history version', async () => {
    await assertFails(getDoc(doc(authB.firestore(), history)));
  });
  await test('Other user cannot list history versions', async () => {
    await assertFails(getDocs(collection(authB.firestore(), `${latest}/versions`)));
  });
  await test('Owner cannot overwrite existing history version', async () => {
    await assertFails(updateDoc(doc(authA.firestore(), history), { payload: '{}' }));
    await assertFails(setDoc(doc(authA.firestore(), history), snapshot()));
  });
  await test('Owner cannot delete existing history version', async () => {
    await assertFails(deleteDoc(doc(authA.firestore(), history)));
  });
  await test('Non-owner cannot delete existing history version', async () => {
    await assertFails(deleteDoc(doc(authB.firestore(), history)));
  });
} finally {
  await env.cleanup();
}
